const BookingModel = require('../../../infrastructure/database/booking.model');
const { Booking } = require('../entities/Booking');
const logger = require('../../../shared/logger');

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
      // runValidators: update ops skip schema validation by default, which is
      // how documents missing required fields (e.g. parent) slipped into prod.
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
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

    // Skip documents that can't be reconstituted (e.g. legacy/corrupt data
    // missing required fields) instead of failing the whole listing.
    return docs
      .map((d) => {
        try {
          return this._toDomain(d);
        } catch (err) {
          logger.error(
            `Skipping corrupt booking document ${d.bookingId || d._id}: ${err.message}`
          );
          return null;
        }
      })
      .filter(Boolean);
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
    // Convert the whole document once instead of poking .toObject on each
    // subdocument — legacy/corrupt docs may be missing parent/timeSlot entirely.
    const data = typeof doc.toObject === 'function' ? doc.toObject() : doc;

    // Legacy docs predate startAt/endAt: derive them from scheduledDate + timeSlot.
    let { startAt, endAt } = data;
    if (!startAt && data.scheduledDate && data.timeSlot) {
      startAt = this._combineDateAndTime(data.scheduledDate, data.timeSlot.startTime);
      endAt = this._combineDateAndTime(data.scheduledDate, data.timeSlot.endTime);
    }

    return new Booking({
      id: data.bookingId,
      parent: data.parent || { fullName: '(missing)', email: '', phone: '' },
      students: data.students || [],
      sessionType: data.sessionType,
      curriculum: data.curriculum,
      subjects: data.subjects,
      startAt,
      endAt,
      timezone: data.timezone,
      scheduledDate: data.scheduledDate,
      timeSlot: data.timeSlot,
      notes: data.notes,
      isFreeTrialed: data.isFreeTrialed,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  /** Combines a date with an "HH:mm" time string (legacy fallback). */
  _combineDateAndTime(date, time) {
    if (!time) return undefined;
    const [hours, minutes] = time.split(':').map(Number);
    const combined = new Date(date);
    combined.setUTCHours(hours, minutes, 0, 0);
    return combined;
  }
}

module.exports = new BookingRepository();
