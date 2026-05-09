const router = require('express').Router();
const scheduleController = require('../controllers/schedule.controller');
const auth = require('../middleware/auth.middleware');

// Public: get available slots for a date
router.get('/available', scheduleController.availableSlots.bind(scheduleController));

// Protected: manage availability
router.get('/availability', auth, scheduleController.listAvailability.bind(scheduleController));
router.post('/availability', auth, scheduleController.setAvailability.bind(scheduleController));

module.exports = router;
