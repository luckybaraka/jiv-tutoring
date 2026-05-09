const router = require('express').Router();
const bookingController = require('../controllers/booking.controller');
const validate = require('../middleware/validate.middleware');
const { createBookingSchema } = require('../validators/booking.validator');

router.post('/', validate(createBookingSchema), bookingController.create.bind(bookingController));
router.get('/availability', bookingController.checkAvailability.bind(bookingController));
router.get('/:id', bookingController.getById.bind(bookingController));

module.exports = router;
