const { getTransporter } = require('../../../infrastructure/email/transporter');
const {
  adminBookingTemplate,
  parentConfirmationTemplate,
  contactMessageTemplate,
  passwordResetTemplate,
} = require('../templates/email.templates');
const logger = require('../../../shared/logger');

class NotificationService {
  constructor() {
    this.adminEmail = process.env.ADMIN_EMAIL || 'info@jivtutoring.com';
    this.fromName = process.env.EMAIL_FROM_NAME || 'JIV Tutoring Services';
    this.fromAddress = process.env.EMAIL_USER || 'info@jivtutoring.com';
  }

  _from() {
    return `"${this.fromName}" <${this.fromAddress}>`;
  }

  /**
   * Sends booking notification both to admin AND to parent.
   * Even if one fails, the other is still attempted.
   */
  async sendBookingNotifications(booking) {
    const adminEmailPromise = this._send({
      to: this.adminEmail,
      subject: `📚 New Booking: ${booking.parent.fullName} (${booking.curriculum})`,
      html: adminBookingTemplate(booking.toJSON ? booking.toJSON() : booking),
    });

    const parentEmailPromise = this._send({
      to: booking.parent.email,
      subject: '✅ Your JIV Tutoring booking has been received',
      html: parentConfirmationTemplate(booking.toJSON ? booking.toJSON() : booking),
    });

    const results = await Promise.allSettled([adminEmailPromise, parentEmailPromise]);
    results.forEach((r, i) => {
      const label = i === 0 ? 'admin' : 'parent';
      if (r.status === 'rejected') {
        logger.error(`Failed to send ${label} email:`, r.reason);
      } else {
        logger.info(`Sent booking email to ${label}`);
      }
    });

    return {
      adminSent: results[0].status === 'fulfilled',
      parentSent: results[1].status === 'fulfilled',
    };
  }

  async sendPasswordReset(admin, resetUrl, ttlMinutes) {
    return this._send({
      to: admin.email,
      subject: '🔑 Reset your JIV Tutoring admin password',
      html: passwordResetTemplate({
        name: admin.name,
        resetUrl,
        ttlMinutes,
      }),
    });
  }

  async sendContactMessage(data) {
    return this._send({
      to: this.adminEmail,
      subject: `📨 Contact Message from ${data.name}`,
      html: contactMessageTemplate(data),
      replyTo: data.email,
    });
  }

  async _send({ to, subject, html, replyTo }) {
    try {
      const transporter = getTransporter();
      const info = await transporter.sendMail({
        from: this._from(),
        to,
        subject,
        html,
        replyTo,
      });
      logger.info(`Email sent to ${to}: ${info.messageId}`);
      return info;
    } catch (err) {
      logger.error(`Email send failed to ${to}:`, err.message);
      throw err;
    }
  }
}

module.exports = new NotificationService();
