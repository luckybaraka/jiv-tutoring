const BookingModel = require('../../../infrastructure/database/booking.model');
const { Booking } = require('../entities/Booking');

/**
 * Booking Repository (DDD Repository pattern)
 * Persists and reconstitutes Booking aggregates.
 *
 * Conflict detection is interval-based: a slot is considered taken if any
 * existing PENDING/APPROVED booking overlaps the requested [startAt, endAt)
 * window. This assumes a single tutor (the only one), so any overlap is a
 * conflict.
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
        startAt: data.startAt,
        endAt: data.endAt,
        timezone: data.timezone,
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
      .sort({ startAt: -1 })
      .limit(limit)
      .skip(skip);

    return docs.map((d) => this._toDomain(d));
  }

  async count(filters = {}) {
    return BookingModel.countDocuments(filters);
  }

  /**
   * True if any active booking overlaps the half-open window [startAt, endAt).
   * Two intervals overlap iff existing.startAt < new.endAt && existing.endAt > new.startAt.
   * `excludeBookingId` lets reschedules ignore the booking being moved.
   */
  async hasOverlap(startAt, endAt, { excludeBookingId } = {}) {
    const query = {
      status: { $in: ['PENDING', 'APPROVED'] },
      startAt: { $lt: endAt },
      endAt: { $gt: startAt },
    };
    if (excludeBookingId) query.bookingId = { $ne: excludeBookingId };
    return !!(await BookingModel.exists(query));
  }

  /** Returns the next-available start time at or after `startAt` for a given duration. */
  async findConflictingBooking(startAt, endAt) {
    return BookingModel.findOne({
      status: { $in: ['PENDING', 'APPROVED'] },
      startAt: { $lt: endAt },
      endAt: { $gt: startAt },
    });
  }

  async getStatistics() {
    const now = new Date();
    const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      total,
      pending,
      approved,
      completed,
      rejected,
      cancelled,
      individual,
      group,
      last30Days,
      byCurriculumAgg,
      totalStudentsAgg,
    ] = await Promise.all([
      BookingModel.countDocuments({}),
      BookingModel.countDocuments({ status: 'PENDING' }),
      BookingModel.countDocuments({ status: 'APPROVED' }),
      BookingModel.countDocuments({ status: 'COMPLETED' }),
      BookingModel.countDocuments({ status: 'REJECTED' }),
      BookingModel.countDocuments({ status: 'CANCELLED' }),
      BookingModel.countDocuments({ sessionType: 'INDIVIDUAL' }),
      BookingModel.countDocuments({ sessionType: 'GROUP' }),
      BookingModel.countDocuments({ createdAt: { $gte: last30 } }),
      BookingModel.aggregate([
        { $group: { _id: '$curriculum', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      BookingModel.aggregate([
        { $project: { count: { $size: { $ifNull: ['$students', []] } } } },
        { $group: { _id: null, total: { $sum: '$count' } } },
      ]),
    ]);

    const byCurriculum = byCurriculumAgg.reduce(
      (acc, row) => ({ ...acc, [row._id]: row.count }),
      {}
    );

    return {
      total,
      pending,
      approved,
      completed,
      rejected,
      cancelled,
      individual,
      group,
      last30Days,
      totalStudents: totalStudentsAgg[0]?.total || 0,
      byCurriculum,
    };
  }

  async delete(id) {
    return BookingModel.deleteOne({ bookingId: id });
  }

  _toDomain(doc) {
    return new Booking({
      id: doc.bookingId,
      parent: doc.parent.toObject ? doc.parent.toObject() : doc.parent,
      students: doc.students.map((s) => (s.toObject ? s.toObject() : s)),
      sessionType: doc.sessionType,
      curriculum: doc.curriculum,
      subjects: doc.subjects,
      startAt: doc.startAt,
      endAt: doc.endAt,
      timezone: doc.timezone,
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
