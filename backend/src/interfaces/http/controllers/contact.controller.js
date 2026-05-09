const notificationService = require('../../../domains/notification/services/NotificationService');

class ContactController {
  async send(req, res, next) {
    try {
      await notificationService.sendContactMessage(req.body);
      res.status(200).json({
        success: true,
        message: 'Thank you! Your message has been sent. We will reply soon.',
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ContactController();
