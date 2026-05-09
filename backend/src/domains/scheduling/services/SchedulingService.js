const { Availability, BlockedSlot } = require('../../../infrastructure/database/schedule.model');
const BookingModel = require('../../../infrastructure/database/booking.model');

/**
 * Generates available time slots for a given date by:
 * 1. Loading the day's availability window
 * 2. Slicing it into 60-min slots (45 min session + 15 min buffer)
 * 3. Removing blocked slots and slots already booked
 */
class SchedulingService {
  async getAvailableSlots(date) {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const dayOfWeek = targetDate.getDay();

    const availability = await Availability.findOne({ dayOfWeek, isActive: true });
    if (!availability) {
      return { date, slots: [] };
    }

    const allSlots = this._generateSlots(availability.startTime, availability.endTime);

    // Remove blocked slots
    const dayEnd = new Date(targetDate);
    dayEnd.setHours(23, 59, 59, 999);
    const blockedSlots = await BlockedSlot.find({
      date: { $gte: targetDate, $lte: dayEnd },
    });
    const blockedTimes = new Set(blockedSlots.map((b) => b.startTime));

    // Remove already-booked slots
    const bookedSlots = await BookingModel.find({
      scheduledDate: { $gte: targetDate, $lte: dayEnd },
      status: { $in: ['PENDING', 'APPROVED'] },
    }).select('timeSlot.startTime');
    const bookedTimes = new Set(bookedSlots.map((b) => b.timeSlot.startTime));

    const available = allSlots.filter(
      (s) => !blockedTimes.has(s) && !bookedTimes.has(s)
    );

    return { date: targetDate.toISOString(), slots: available };
  }

  _generateSlots(start, end, intervalMinutes = 60) {
    const slots = [];
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    let current = sh * 60 + sm;
    const endMin = eh * 60 + em;
    while (current + 45 <= endMin) {
      const h = String(Math.floor(current / 60)).padStart(2, '0');
      const m = String(current % 60).padStart(2, '0');
      slots.push(`${h}:${m}`);
      current += intervalMinutes;
    }
    return slots;
  }

  async setAvailability(dayOfWeek, startTime, endTime) {
    return Availability.findOneAndUpdate(
      { dayOfWeek },
      { dayOfWeek, startTime, endTime, isActive: true },
      { upsert: true, new: true }
    );
  }

  async listAvailability() {
    return Availability.find({ isActive: true }).sort({ dayOfWeek: 1 });
  }

  async blockSlot(date, startTime, reason) {
    return BlockedSlot.create({ date, startTime, reason });
  }

  async unblockSlot(id) {
    return BlockedSlot.findByIdAndDelete(id);
  }

  /** Seeds default Mon–Sat 08:00–18:00 availability. */
  async ensureDefaultAvailability() {
    const count = await Availability.countDocuments({});
    if (count === 0) {
      const defaults = [1, 2, 3, 4, 5, 6].map((d) => ({
        dayOfWeek: d,
        startTime: '08:00',
        endTime: '18:00',
        isActive: true,
      }));
      await Availability.insertMany(defaults);
    }
  }
}

module.exports = new SchedulingService();
