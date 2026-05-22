import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  getVehicleBookings,
  updateBookingStatus,
  cancelBooking,
  getSellerBookings,
} from '../controllers/booking.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authenticate, authorize('user'), createBooking);
router.get('/my-bookings', authenticate, authorize('user'), getMyBookings);
router.get('/seller-bookings', authenticate, authorize('seller'), getSellerBookings);
router.get('/vehicle/:vehicleId', authenticate, getVehicleBookings);
router.get('/:id', authenticate, getBookingById);
router.put('/:id/status', authenticate, authorize('seller'), updateBookingStatus);
router.put('/:id/cancel', authenticate, authorize('user'), cancelBooking);

export default router;
