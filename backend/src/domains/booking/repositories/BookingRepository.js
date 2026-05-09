const BookingModel = require('../../../infrastructure/database/booking.model');
const { Booking } = require('../entities/Booking');

/**
 * Booking Repository (DDD Repository pattern)
 * Persists and reconstitutes Booking aggregates.
 */
class BookingRepository {
  async save(booking) {
    const data = booking.toJSON();
    const doc = await BookingModel.findOneAndUpdate(
      { bookingId: data.id },
      {
        bookingId: data.id,
        parent: data.parent,
        students: data.students,
        sessionType: data.sessionType,
        curriculum: data.curriculum,
        subjects: data.subjects,
        scheduledDate: data.scheduledDate,
        timeSlot: data.timeSlot,
        notes: data.notes,
        isFreeTrialed: data.isFreeTrialed,
        discountPercentage: data.discountPercentage,
        status: data.status,
        rejectionReason: booking.rejectionReason,
      },
      { upsert: true, new: true }
    );
    return this._toDomain(doc);
  }

  async findById(id) {
    const doc = await BookingModel.findOne({ bookingId: id });
    return doc ? this._toDomain(doc) : null;
  }

  async findAll(filters = {}, options = {}) {
    const query = {};
    if (filters.status) query.status = filters.status;
    if (filters.curriculum) query.curriculum = filters.curriculum;
    if (filters.sessionType) query.sessionType = filters.sessionType;

    const limit = options.limit || 50;
    const skip = options.skip || 0;
    const docs = await BookingModel.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    return docs.map((d) => this._toDomain(d));
  }

  async count(filters = {}) {
    return BookingModel.countDocuments(filters);
  }

  /** Critical: prevents double booking of time slots */
  async isSlotTaken(scheduledDate, startTime) {
    const start = new Date(scheduledDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(scheduledDate);
    end.setHours(23, 59, 59, 999);

    const existing = await BookingModel.findOne({
      scheduledDate: { $gte: start, $lte: end },
      'timeSlot.startTime': startTime,
      status: { $in: ['PENDING', 'APPROVED'] },
    });
    return !!existing;
  }

  async getStatistics() {
    const [total, pending, approved, completed] = await Promise.all([
      BookingModel.countDocuments({}),
      BookingModel.countDocuments({ status: 'PENDING' }),
      BookingModel.countDocuments({ status: 'APPROVED' }),
      BookingModel.countDocuments({ status: 'COMPLETED' }),
    ]);
    return { total, pending, approved, completed };
  }

  _toDomain(doc) {
    return new Booking({
      id: doc.bookingId,
      parent: doc.parent.toObject ? doc.parent.toObject() : doc.parent,
      students: doc.students.map((s) => (s.toObject ? s.toObject() : s)),
      sessionType: doc.sessionType,
      curriculum: doc.curriculum,
      subjects: doc.subjects,
      scheduledDate: doc.scheduledDate,
      timeSlot: doc.timeSlot.toObject ? doc.timeSlot.toObject() : doc.timeSlot,
      notes: doc.notes,
      isFreeTrialed: doc.isFreeTrialed,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}

module.exports = new BookingRepository();
