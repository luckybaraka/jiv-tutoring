const bookingService = require('../../../domains/booking/services/BookingService');

class AdminController {
  async listBookings(req, res, next) {
    try {
      const filters = {};
      if (req.query.status) filters.status = req.query.status;
      if (req.query.curriculum) filters.curriculum = req.query.curriculum;
      if (req.query.sessionType) filters.sessionType = req.query.sessionType;

      const limit = parseInt(req.query.limit, 10) || 50;
      const skip = parseInt(req.query.skip, 10) || 0;

      const bookings = await bookingService.listBookings(filters, { limit, skip });
      res.json({
        success: true,
        count: bookings.length,
        data: bookings.map((b) => b.toJSON()),
      });
    } catch (err) {
      next(err);
    }
  }

  async stats(req, res, next) {
    try {
      const stats = await bookingService.getStatistics();
      res.json({ success: true, data: stats });
    } catch (err) {
      next(err);
    }
  }

  async approve(req, res, next) {
    try {
      const booking = await bookingService.approveBooking(req.params.id);
      res.json({ success: true, data: booking.toJSON() });
    } catch (err) {
      next(err);
    }
  }

  async reject(req, res, next) {
    try {
      const booking = await bookingService.rejectBooking(
        req.params.id,
        req.body.reason || 'Not specified'
      );
      res.json({ success: true, data: booking.toJSON() });
    } catch (err) {
      next(err);
    }
  }

  async complete(req, res, next) {
    try {
      const booking = await bookingService.completeBooking(req.params.id);
      res.json({ success: true, data: booking.toJSON() });
    } catch (err) {
      next(err);
    }
  }

  async cancel(req, res, next) {
    try {
      const booking = await bookingService.cancelBooking(req.params.id);
      res.json({ success: true, data: booking.toJSON() });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminController();
