const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Defines tutor availability.
 * dayOfWeek: 0 = Sunday ... 6 = Saturday
 */
const availabilitySchema = new Schema(
  {
    dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
    startTime: { type: String, required: true }, // "08:00"
    endTime: { type: String, required: true },   // "18:00"
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const blockedSlotSchema = new Schema(
  {
    date: { type: Date, required: true, index: true },
    startTime: { type: String, required: true },
    reason: { type: String, default: 'Not available' },
  },
  { timestamps: true }
);

const Availability = mongoose.model('Availability', availabilitySchema);
const BlockedSlot = mongoose.model('BlockedSlot', blockedSlotSchema);

module.exports = { Availability, BlockedSlot };
