const { v4: uuidv4 } = require('uuid');
const { ValidationError } = require('../../../shared/errors');

const SESSION_TYPES = Object.freeze({
  INDIVIDUAL: 'INDIVIDUAL',
  GROUP: 'GROUP',
});

const CURRICULA = Object.freeze({
  CBC: 'CBC',
  CBE: 'CBE',
  IGCSE: 'IGCSE',
  GCSE: 'GCSE',
  'MYP/IB': 'MYP/IB',
  American: 'American',
});

const BOOKING_STATUSES = Object.freeze({
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
});

class Booking {
  constructor({
    id = uuidv4(),
    parent,
    students,
    sessionType,
    curriculum,
    subjects,
    startAt,
    endAt,
    timezone = 'Africa/Nairobi',
    scheduledDate,
    timeSlot,
    notes = '',
    isFreeTrialed = true,
    status = BOOKING_STATUSES.PENDING,
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    this.id = id;
    this.parent = parent;
    this.students = students;
    this.sessionType = sessionType;
    this.curriculum = curriculum;
    this.subjects = subjects;
    this.startAt = startAt instanceof Date ? startAt : new Date(startAt);
    this.endAt = endAt instanceof Date ? endAt : new Date(endAt);
    this.timezone = timezone;
    // Legacy / display fields — kept in sync with startAt/endAt by the service.
    this.scheduledDate = scheduledDate || this.startAt;
    this.timeSlot = timeSlot;
    this.notes = notes;
    this.isFreeTrialed = isFreeTrialed;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    this.validate();
  }

  validate() {
    if (!Object.values(SESSION_TYPES).includes(this.sessionType)) {
      throw new ValidationError('Invalid session type');
    }

    if (!Object.values(CURRICULA).includes(this.curriculum)) {
      throw new ValidationError(
        'Curriculum must be one of: CBC, CBE, IGCSE, GCSE, MYP/IB, American'
      );
    }

    if (!this.students || this.students.length === 0) {
      throw new ValidationError('At least one student is required');
    }

    if (this.sessionType === SESSION_TYPES.GROUP) {
      if (this.students.length < 2 || this.students.length > 5) {
        throw new ValidationError(
          'Group sessions must have between 2 and 5 students'
        );
      }
    }

    if (this.sessionType === SESSION_TYPES.INDIVIDUAL && this.students.length !== 1) {
      throw new ValidationError('Individual sessions must have exactly 1 student');
    }

    if (!this.subjects || this.subjects.length === 0) {
      throw new ValidationError('At least one subject is required');
    }

    if (!(this.startAt instanceof Date) || isNaN(this.startAt.getTime())) {
      throw new ValidationError('startAt must be a valid date');
    }
    if (!(this.endAt instanceof Date) || isNaN(this.endAt.getTime())) {
      throw new ValidationError('endAt must be a valid date');
    }
    if (this.endAt <= this.startAt) {
      throw new ValidationError('endAt must be after startAt');
    }
  }

  /** Computes group discount as a business rule */
  getDiscountPercentage() {
    if (this.sessionType !== SESSION_TYPES.GROUP) return 0;
    const count = this.students.length;
    if (count === 2) return 10;
    if (count === 3) return 15;
    if (count === 4) return 20;
    if (count === 5) return 25;
    return 0;
  }

  approve() {
    if (this.status !== BOOKING_STATUSES.PENDING) {
      throw new ValidationError('Only pending bookings can be approved');
    }
    this.status = BOOKING_STATUSES.APPROVED;
    this.updatedAt = new Date();
  }

  reject(reason) {
    if (this.status !== BOOKING_STATUSES.PENDING) {
      throw new ValidationError('Only pending bookings can be rejected');
    }
    this.status = BOOKING_STATUSES.REJECTED;
    this.rejectionReason = reason;
    this.updatedAt = new Date();
  }

  cancel() {
    if ([BOOKING_STATUSES.COMPLETED, BOOKING_STATUSES.CANCELLED].includes(this.status)) {
      throw new ValidationError('Cannot cancel a completed or already cancelled booking');
    }
    this.status = BOOKING_STATUSES.CANCELLED;
    this.updatedAt = new Date();
  }

  complete() {
    if (this.status !== BOOKING_STATUSES.APPROVED) {
      throw new ValidationError('Only approved bookings can be marked as completed');
    }
    this.status = BOOKING_STATUSES.COMPLETED;
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      parent: this.parent,
      students: this.students,
      sessionType: this.sessionType,
      curriculum: this.curriculum,
      subjects: this.subjects,
      startAt: this.startAt,
      endAt: this.endAt,
      timezone: this.timezone,
      // Legacy/display fields
      scheduledDate: this.scheduledDate,
      timeSlot: this.timeSlot,
      notes: this.notes,
      isFreeTrialed: this.isFreeTrialed,
      status: this.status,
      discountPercentage: this.getDiscountPercentage(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = { Booking, SESSION_TYPES, CURRICULA, BOOKING_STATUSES };
