const bookingService = require('../../domains/booking/services/BookingService');
const notificationService = require('../../domains/notification/services/NotificationService');
const logger = require('../../shared/logger');

/**
 * CreateBookingUseCase
 * Orchestrates: 1) Booking creation 2) Email notifications (admin + parent)
 *
 * Email sending is fire-and-forget so a slow SMTP server never blocks the API response.
 * Booking creation success is the source of truth.
 */
class CreateBookingUseCase {
  async execute(input) {
    const booking = await bookingService.createBooking(input);

    // Notify both admin and parent in the background
    notificationService
      .sendBookingNotifications(booking)
      .catch((err) => logger.error('Notification dispatch failed:', err));

    return booking;
  }
}

module.exports = new CreateBookingUseCase();
