const { Booking, SESSION_TYPES } = require('../entities/Booking');
const Student = require('../entities/Student');
const ContactInfo = require('../value-objects/ContactInfo');
const bookingRepository = require('../repositories/BookingRepository');
const { ConflictError, ValidationError, NotFoundError } = require('../../../shared/errors');

const DEFAULT_DURATION_MINUTES = 45;

/**
 * Formats a Date in a given IANA timezone as a "HH:MM" 24-hour string.
 * Uses Intl with hourCycle:'h23' so midnight is always "00:00".
 */
function formatHHMMInZone(date, timezone) {
  try {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    });
    return fmt.format(date);
  } catch {
    // Fallback: server local time if the IANA name is invalid.
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    });
    return fmt.format(date);
  }
}

/**
 * Validates an IANA timezone string by attempting to construct a formatter.
 * Returns the timezone if valid, throws otherwise.
 */
function validateTimezone(tz) {
  try {
    new Intl.DateTimeFormat('en-GB', { timeZone: tz });
    return tz;
  } catch {
    throw new ValidationError(`Invalid timezone: ${tz}`);
  }
}

/**
 * Booking Domain Service
 * Encapsulates the business logic of creating and managing bookings.
 */
class BookingService {
  /**
   * Creates a new booking, enforcing all business rules:
   *   - Single-tutor overlap detection on [startAt, endAt) in UTC.
   *   - Duration defaults to 45 minutes.
   *   - Stores both canonical UTC instants and timezone-formatted display fields.
   */
  async createBooking(input) {
    // 1. Validate parent contact info via value object
    const contactInfo = new ContactInfo({
      email: input.parent.email,
      phone: input.parent.phone,
    });

    // 2. Build student entities
    const students = (input.students || []).map(
      (s) =>
        new Student({
          name: s.name,
          age: s.age,
          gradeOrClass: s.gradeOrClass,
          learningChallenges: s.learningChallenges || '',
        })
    );

    // 3. Validate group size
    if (input.sessionType === SESSION_TYPES.GROUP) {
      if (students.length < 2 || students.length > 5) {
        throw new ValidationError(
          'Group sessions require between 2 and 5 students.'
        );
      }
    }

    // 4. Validate timezone (defaults to Africa/Nairobi if missing)
    const timezone = validateTimezone(input.timezone || 'Africa/Nairobi');

    // 5. Parse startAt (must be a UTC ISO instant)
    if (!input.startAt) {
      throw new ValidationError('startAt is required');
    }
    const startAt = new Date(input.startAt);
    if (isNaN(startAt.getTime())) {
      throw new ValidationError('startAt must be a valid ISO datetime');
    }

    // 6. Compute endAt from duration
    const durationMinutes =
      Number(input.durationMinutes) || DEFAULT_DURATION_MINUTES;
    if (![45, 60, 90].includes(durationMinutes)) {
      throw new ValidationError('durationMinutes must be 45, 60, or 90');
    }
    const endAt = new Date(startAt.getTime() + durationMinutes * 60 * 1000);

    // 7. Must be in the future
    if (startAt <= new Date()) {
      throw new ValidationError('Scheduled time must be in the future');
    }

    // 8. Single-tutor overlap check
    const conflicts = await bookingRepository.hasOverlap(startAt, endAt);
    if (conflicts) {
      throw new ConflictError(
        'That time overlaps an existing booking. Our tutor is occupied — please pick another time.'
      );
    }

    // 9. Build display-friendly legacy fields in the booker's timezone
    const startTime = formatHHMMInZone(startAt, timezone);
    const endTime = formatHHMMInZone(endAt, timezone);

    // 10. Build the booking aggregate
    const booking = new Booking({
      parent: {
        fullName: input.parent.fullName,
        ...contactInfo.toJSON(),
      },
      students: students.map((s) => s.toJSON()),
      sessionType: input.sessionType,
      curriculum: input.curriculum,
      subjects: input.subjects,
      startAt,
      endAt,
      timezone,
      scheduledDate: startAt,
      timeSlot: { startTime, endTime, durationMinutes },
      notes: input.notes || '',
      isFreeTrialed: input.isFreeTrialed !== false,
    });

    // 11. Persist and return
    return bookingRepository.save(booking);
  }

  async getBookingById(id) {
    return bookingRepository.findById(id);
  }

  async listBookings(filters, options) {
    return bookingRepository.findAll(filters, options);
  }

  async approveBooking(id) {
    const booking = await bookingRepository.findById(id);
    if (!booking) throw new ValidationError('Booking not found');
    booking.approve();
    return bookingRepository.save(booking);
  }

  async rejectBooking(id, reason) {
    const booking = await bookingRepository.findById(id);
    if (!booking) throw new ValidationError('Booking not found');
    booking.reject(reason);
    return bookingRepository.save(booking);
  }

  async cancelBooking(id) {
    const booking = await bookingRepository.findById(id);
    if (!booking) throw new ValidationError('Booking not found');
    booking.cancel();
    return bookingRepository.save(booking);
  }

  async completeBooking(id) {
    const booking = await bookingRepository.findById(id);
    if (!booking) throw new ValidationError('Booking not found');
    booking.complete();
    return bookingRepository.save(booking);
  }

  async getStatistics() {
    return bookingRepository.getStatistics();
  }

  async deleteBooking(id) {
    const booking = await bookingRepository.findById(id);
    if (!booking) throw new NotFoundError('Booking not found');
    await bookingRepository.delete(id);
    return { id };
  }

  /**
   * Returns whether a proposed slot is free.
   * Used by the booking page for real-time conflict warnings.
   */
  async checkAvailability({ startAt, durationMinutes = DEFAULT_DURATION_MINUTES }) {
    const start = new Date(startAt);
    if (isNaN(start.getTime())) {
      throw new ValidationError('startAt must be a valid ISO datetime');
    }
    if (![45, 60, 90].includes(Number(durationMinutes))) {
      throw new ValidationError('durationMinutes must be 45, 60, or 90');
    }
    const end = new Date(start.getTime() + Number(durationMinutes) * 60 * 1000);
    const conflict = await bookingRepository.findConflictingBooking(start, end);
    return {
      available: !conflict,
      conflict: conflict
        ? {
            startAt: conflict.startAt,
            endAt: conflict.endAt,
            timezone: conflict.timezone,
          }
        : null,
    };
  }
}

module.exports = new BookingService();
