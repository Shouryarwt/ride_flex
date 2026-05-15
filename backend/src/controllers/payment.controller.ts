import { Response } from 'express';
import { Payment } from '../models/Payment.model.js';
import { Booking } from '../models/Booking.model.js';
import { AuthRequest } from '../types/index.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createPayment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { bookingId, amount, paymentMethod } = req.body;

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking.user.toString() !== req.user!._id.toString()) {
    throw new ApiError(403, 'You can only pay for your own bookings');
  }

  if (booking.paymentStatus === 'paid') {
    throw new ApiError(400, 'Booking is already paid');
  }

  // Generate transaction ID (in production, this would come from payment gateway)
  const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  const payment = await Payment.create({
    booking: bookingId,
    user: req.user!._id,
    amount,
    paymentMethod,
    transactionId,
    status: 'success', // In production, this would be updated by payment gateway callback
  });

  // Update booking payment status
  booking.paymentStatus = 'paid';
  booking.bookingStatus = 'confirmed';
  await booking.save();

  res.status(201).json({
    success: true,
    message: 'Payment processed successfully',
    payment,
  });
});

export const getPaymentByBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const payment = await Payment.findOne({ booking: req.params.bookingId })
    .populate('booking')
    .populate('user', 'name email');

  if (!payment) {
    throw new ApiError(404, 'Payment not found for this booking');
  }

  res.status(200).json({
    success: true,
    payment,
  });
});

export const getMyPayments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const payments = await Payment.find({ user: req.user!._id })
    .populate({
      path: 'booking',
      populate: { path: 'vehicle', select: 'title type' }
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    payments,
  });
});
