const express = require('express');
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
} = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('user', 'seller', 'admin'), createBooking);
router.get('/me', authMiddleware, roleMiddleware('user', 'seller', 'admin'), getMyBookings);
router.get('/', authMiddleware, roleMiddleware('admin'), getAllBookings);
router.patch('/:id/status', authMiddleware, roleMiddleware('admin'), updateBookingStatus);

module.exports = router;
