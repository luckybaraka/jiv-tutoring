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
      enum: ['CBC', 'IGCSE'],
      required: true,
    },
    subjects: { type: [String], required: true },
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

// Composite index to prevent double bookings
bookingSchema.index(
  { scheduledDate: 1, 'timeSlot.startTime': 1, status: 1 },
  { name: 'slot_booking_idx' }
);

module.exports = mongoose.model('Booking', bookingSchema);
