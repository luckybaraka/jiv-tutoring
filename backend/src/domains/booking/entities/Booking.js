const { v4: uuidv4 } = require('uuid');
const { ValidationError } = require('../../../shared/errors');

const SESSION_TYPES = Object.freeze({
  INDIVIDUAL: 'INDIVIDUAL',
  GROUP: 'GROUP',
});

const CURRICULA = Object.freeze({
  CBC: 'CBC',
  IGCSE: 'IGCSE',
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
    this.scheduledDate = scheduledDate;
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
      throw new ValidationError('Curriculum must be CBC or IGCSE');
    }

    if (!this.students || this.students.length === 0) {
      throw new ValidationError('At least one student is required');
    }

    // Business rule: GROUP sessions must have 2 to 5 students
    if (this.sessionType === SESSION_TYPES.GROUP) {
      if (this.students.length < 2 || this.students.length > 5) {
        throw new ValidationError(
          'Group sessions must have between 2 and 5 students'
        );
      }
    }

    // Business rule: INDIVIDUAL sessions must have exactly 1 student
    if (this.sessionType === SESSION_TYPES.INDIVIDUAL && this.students.length !== 1) {
      throw new ValidationError('Individual sessions must have exactly 1 student');
    }

    if (!this.subjects || this.subjects.length === 0) {
      throw new ValidationError('At least one subject is required');
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
