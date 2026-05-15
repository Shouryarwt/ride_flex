import { Router } from 'express';
import { createPayment, getPaymentByBooking, getMyPayments } from '../controllers/payment.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authenticate, createPayment);
router.get('/my-payments', authenticate, getMyPayments);
router.get('/booking/:bookingId', authenticate, getPaymentByBooking);

export default router;
