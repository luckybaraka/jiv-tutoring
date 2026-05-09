const schedulingService = require('../../../domains/scheduling/services/SchedulingService');

class ScheduleController {
  async availableSlots(req, res, next) {
    try {
      const { date } = req.query;
      if (!date) {
        return res.status(400).json({ success: false, message: 'date query is required' });
      }
      const result = await schedulingService.getAvailableSlots(date);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async setAvailability(req, res, next) {
    try {
      const { dayOfWeek, startTime, endTime } = req.body;
      const result = await schedulingService.setAvailability(dayOfWeek, startTime, endTime);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async listAvailability(req, res, next) {
    try {
      const result = await schedulingService.listAvailability();
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ScheduleController();
