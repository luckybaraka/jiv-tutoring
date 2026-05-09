const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validate.middleware');
const auth = require('../middleware/auth.middleware');
const { loginSchema } = require('../validators/booking.validator');

router.post('/login', validate(loginSchema), authController.login.bind(authController));
router.get('/me', auth, authController.me.bind(authController));

module.exports = router;
