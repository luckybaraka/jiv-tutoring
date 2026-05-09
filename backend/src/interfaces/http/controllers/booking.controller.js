const createBookingUseCase = require('../../../application/use-cases/CreateBookingUseCase');
const bookingService = require('../../../domains/booking/services/BookingService');

class BookingController {
  async create(req, res, next) {
    try {
      const booking = await createBookingUseCase.execute(req.body);
      res.status(201).json({
        success: true,
        message:
          'Booking received! Check your email — we have sent a confirmation and will be in touch soon.',
        data: booking.toJSON(),
      });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const booking = await bookingService.getBookingById(req.params.id);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      res.json({ success: true, data: booking.toJSON() });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new BookingController();
