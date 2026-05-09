const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 3, max: 25 },
    gradeOrClass: { type: String, required: true },
    learningChallenges: { type: String, default: '' },
  },
  { _id: false }
);

const parentSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const timeSlotSchema = new Schema(
  {
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    durationMinutes: { type: Number, default: 45 },
  },
  { _id: false }
);

const bookingSchema = new Schema(
  {
    bookingId: { type: String, required: true, unique: true, index: true },
    parent: { type: parentSchema, required: true },
    students: { type: [studentSchema], required: true },
    sessionType: {
      type: String,
      enum: ['INDIVIDUAL', 'GROUP'],
      required: true,
    },
    curriculum: {
      type: String,
      enum: ['CBC', 'CBE', 'IGCSE', 'GCSE', 'MYP/IB', 'American'],
      required: true,
    },
    subjects: { type: [String], required: true },

    // Canonical UTC instants — source of truth for conflict detection.
    startAt: { type: Date, required: true, index: true },
    endAt: { type: Date, required: true, index: true },
    timezone: { type: String, required: true, default: 'Africa/Nairobi' },

    // Legacy / display-friendly fields, derived server-side from startAt/endAt
    // and the booker's timezone. Kept for backward compatibility with emails,
    // admin views, and existing data.
    scheduledDate: { type: Date, required: true, index: true },
    timeSlot: { type: timeSlotSchema, required: true },

    notes: { type: String, default: '' },
    isFreeTrialed: { type: Boolean, default: true },
    discountPercentage: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
      index: true,
    },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

// Speeds up the overlap query: { status, startAt, endAt }
bookingSchema.index(
  { status: 1, startAt: 1, endAt: 1 },
  { name: 'overlap_check_idx' }
);

module.exports = mongoose.model('Booking', bookingSchema);
