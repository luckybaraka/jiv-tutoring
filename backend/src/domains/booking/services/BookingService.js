const { Booking, SESSION_TYPES } = require('../entities/Booking');
const Student = require('../entities/Student');
const TimeSlot = require('../value-objects/TimeSlot');
const ContactInfo = require('../value-objects/ContactInfo');
const bookingRepository = require('../repositories/BookingRepository');
const { ConflictError, ValidationError } = require('../../../shared/errors');

/**
 * Booking Domain Service
 * Encapsulates the business logic of creating and managing bookings.
 */
class BookingService {
  /**
   * Creates a new booking, enforcing all business rules.
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

    // 3. Validate group size (also enforced in Booking entity)
    if (input.sessionType === SESSION_TYPES.GROUP) {
      if (students.length < 2 || students.length > 5) {
        throw new ValidationError(
          'Group sessions require between 2 and 5 students.'
        );
      }
    }

    // 4. Validate time slot via value object
    const timeSlot = new TimeSlot({
      startTime: input.timeSlot.startTime,
      durationMinutes: input.timeSlot.durationMinutes || 45,
    });

    // 5. Validate scheduled date is in the future
    const scheduledDate = new Date(input.scheduledDate);
    if (scheduledDate < new Date()) {
      throw new ValidationError('Scheduled date must be in the future');
    }

    // 6. Prevent double booking
    const slotTaken = await bookingRepository.isSlotTaken(
      scheduledDate,
      timeSlot.startTime
    );
    if (slotTaken) {
      throw new ConflictError(
        'This time slot is already booked. Please pick another slot.'
      );
    }

    // 7. Build the booking aggregate
    const booking = new Booking({
      parent: {
        fullName: input.parent.fullName,
        ...contactInfo.toJSON(),
      },
      students: students.map((s) => s.toJSON()),
      sessionType: input.sessionType,
      curriculum: input.curriculum,
      subjects: input.subjects,
      scheduledDate,
      timeSlot: timeSlot.toJSON(),
      notes: input.notes || '',
      isFreeTrialed: input.isFreeTrialed !== false,
    });

    // 8. Persist and return
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
}

module.exports = new BookingService();
