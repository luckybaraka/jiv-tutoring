const { ValidationError } = require('../../../shared/errors');

class ContactInfo {
  constructor({ email, phone }) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new ValidationError('A valid email address is required');
    }

    // Kenyan phone numbers: +254... or 07... or 01...
    const phoneRegex = /^(\+?254|0)(7|1)\d{8}$/;
    const cleaned = (phone || '').replace(/\s+/g, '');
    if (!phoneRegex.test(cleaned)) {
      throw new ValidationError(
        'Phone number must be a valid Kenyan number (e.g., 0726555444 or +254726555444)'
      );
    }

    this.email = email.toLowerCase().trim();
    this.phone = cleaned;
    Object.freeze(this);
  }

  toJSON() {
    return { email: this.email, phone: this.phone };
  }
}

module.exports = ContactInfo;
