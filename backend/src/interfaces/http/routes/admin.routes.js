const router = require('express').Router();
const adminController = require('../controllers/admin.controller');
const auth = require('../middleware/auth.middleware');

router.use(auth); // All admin routes require auth

router.get('/bookings', adminController.listBookings.bind(adminController));
router.get('/stats', adminController.stats.bind(adminController));
router.patch('/bookings/:id/approve', adminController.approve.bind(adminController));
router.patch('/bookings/:id/reject', adminController.reject.bind(adminController));
router.patch('/bookings/:id/complete', adminController.complete.bind(adminController));
router.patch('/bookings/:id/cancel', adminController.cancel.bind(adminController));

module.exports = router;
