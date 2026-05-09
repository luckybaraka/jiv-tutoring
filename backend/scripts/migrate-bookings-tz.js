/**
 * One-shot migration: backfills startAt / endAt / timezone for any booking
 * created under the legacy schema (scheduledDate + timeSlot.startTime).
 *
 * Strategy:
 *   - Combine the booking's `scheduledDate` (UTC date) with `timeSlot.startTime`
 *     (HH:MM in the booker's local zone — assumed Africa/Nairobi for legacy
 *     rows) and produce a real UTC instant.
 *   - endAt = startAt + durationMinutes.
 *   - timezone defaults to "Africa/Nairobi" for legacy rows.
 *
 * Usage:
 *   node scripts/migrate-bookings-tz.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Booking = require('../src/infrastructure/database/booking.model');

const LEGACY_TZ = 'Africa/Nairobi';
const NAIROBI_OFFSET_MINUTES = 180; // UTC+3, no DST

(async () => {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI missing.');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);

  const cursor = Booking.find({
    $or: [
      { startAt: { $exists: false } },
      { endAt: { $exists: false } },
      { timezone: { $exists: false } },
    ],
  }).cursor();

  let migrated = 0;
  let removed = 0;
  for await (const doc of cursor) {
    try {
      if (!doc.scheduledDate || !doc.timeSlot?.startTime) {
        await doc.deleteOne();
        removed += 1;
        continue;
      }
      const [hh, mm] = doc.timeSlot.startTime.split(':').map(Number);
      const day = new Date(doc.scheduledDate);
      // Build the local-time instant in Africa/Nairobi (UTC+3, no DST).
      const localUtcMs = Date.UTC(
        day.getUTCFullYear(),
        day.getUTCMonth(),
        day.getUTCDate(),
        hh,
        mm
      );
      const startAt = new Date(localUtcMs - NAIROBI_OFFSET_MINUTES * 60 * 1000);
      const duration = doc.timeSlot.durationMinutes || 45;
      const endAt = new Date(startAt.getTime() + duration * 60 * 1000);

      doc.startAt = startAt;
      doc.endAt = endAt;
      doc.timezone = LEGACY_TZ;
      await doc.save();
      migrated += 1;
    } catch (err) {
      console.warn(`Could not migrate booking ${doc.bookingId}:`, err.message);
      try {
        await doc.deleteOne();
        removed += 1;
      } catch (_) {}
    }
  }

  console.log(`Migrated ${migrated} booking(s); removed ${removed} unrecoverable row(s).`);
  await mongoose.disconnect();
})();
