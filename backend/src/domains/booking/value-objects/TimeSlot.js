const { ValidationError } = require('../../../shared/errors');

/**
 * TimeSlot Value Object
 * Immutable representation of a session time slot.
 * Free trials are 45 minutes long.
 */
class TimeSlot {
  constructor({ startTime, durationMinutes = 45 }) {
    if (!startTime) {
      throw new ValidationError('Start time is required');
    }

    // Accept "HH:MM" format
    const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(startTime);
    if (!match) {
      throw new ValidationError('Time must be in HH:MM format (e.g., 14:30)');
    }

    this.startTime = startTime;
    this.durationMinutes = durationMinutes;
    this.endTime = this._computeEndTime(startTime, durationMinutes);
    Object.freeze(this);
  }

  _computeEndTime(start, duration) {
    const [h, m] = start.split(':').map(Number);
    const total = h * 60 + m + duration;
    const eh = String(Math.floor(total / 60) % 24).padStart(2, '0');
    const em = String(total % 60).padStart(2, '0');
    return `${eh}:${em}`;
  }

  equals(other) {
    return (
      other instanceof TimeSlot &&
      this.startTime === other.startTime &&
      this.durationMinutes === other.durationMinutes
    );
  }

  toJSON() {
    return {
      startTime: this.startTime,
      endTime: this.endTime,
      durationMinutes: this.durationMinutes,
    };
  }
}

module.exports = TimeSlot;
