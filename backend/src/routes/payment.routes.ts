import { Router } from 'express';
import { createPaymentOrder, verifyPayment, getPaymentByBooking, getMyPayments } from '../controllers/payment.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/order', authenticate, createPaymentOrder);
router.post('/verify', authenticate, verifyPayment);
router.get('/my-payments', authenticate, getMyPayments);
router.get('/booking/:bookingId', authenticate, getPaymentByBooking);

export default router;
