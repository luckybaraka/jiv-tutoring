const router = require('express').Router();
const contactController = require('../controllers/contact.controller');
const validate = require('../middleware/validate.middleware');
const { contactSchema } = require('../validators/booking.validator');

router.post('/', validate(contactSchema), contactController.send.bind(contactController));

module.exports = router;
