import { Response } from 'express';
import { Payment } from '../models/Payment.model.js';
import { Booking } from '../models/Booking.model.js';
import { Notification } from '../models/Notification.model.js';
import { AuthRequest } from '../types/index.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createRazorpayOrder, verifyRazorpaySignature } from '../services/razorpay.service.js';

export const createPaymentOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { bookingId } = req.body;
  const booking = await Booking.findById(bookingId).populate('vehicle', 'title');

  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.user.toString() !== req.user!._id.toString()) throw new ApiError(403, 'You can only pay for your own bookings');
  if (booking.bookingStatus === 'cancelled' || booking.bookingStatus === 'rejected') throw new ApiError(400, 'This booking cannot be paid');
  if (booking.paymentStatus === 'paid') throw new ApiError(400, 'Booking is already paid');
  if (!booking.totalAmount || booking.totalAmount <= 0) throw new ApiError(400, 'Invalid booking amount');

  const order = await createRazorpayOrder(Number(booking.totalAmount), `booking_${booking._id}`);
  booking.paymentStatus = 'authorized';
  booking.paymentProvider = 'razorpay';
  booking.paymentOrderId = order.id;
  await booking.save();

  res.status(201).json({
    success: true,
    order: {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      bookingId: booking._id,
      vehicleTitle: (booking.vehicle as any)?.title,
    },
  });
});

export const verifyPayment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentMethod } = req.body;
  const booking = await Booking.findById(bookingId).populate('vehicle', 'title');

  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.user.toString() !== req.user!._id.toString()) throw new ApiError(403, 'Invalid booking owner');
  if (booking.paymentOrderId !== razorpayOrderId) throw new ApiError(400, 'Payment order mismatch');

  const valid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
  if (!valid) throw new ApiError(400, 'Invalid payment signature');

  if (booking.paymentStatus === 'paid' && booking.paymentTransactionId === razorpayPaymentId) {
    return res.status(200).json({ success: true, message: 'Payment already verified' });
  }

  const existing = await Payment.findOne({ transactionId: razorpayPaymentId });
  if (!existing) {
    await Payment.create({
      booking: booking._id,
      user: req.user!._id,
      amount: booking.totalAmount,
      paymentMethod: paymentMethod || 'upi',
      transactionId: razorpayPaymentId,
      status: 'success',
    });
  }

  booking.paymentStatus = 'paid';
  booking.paymentTransactionId = razorpayPaymentId;
  booking.bookingStatus = 'confirmed';
  await booking.save();

  await Notification.create({
    recipient: booking.user,
    booking: booking._id,
    type: 'booking_confirmed',
    message: `Payment confirmed for ${(booking.vehicle as any)?.title || 'your vehicle booking'}.`,
  });

  res.status(200).json({ success: true, message: 'Payment verified successfully' });
});

export const getPaymentByBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const payment = await Payment.findOne({ booking: req.params.bookingId }).populate('booking').populate('user', 'name email');
  if (!payment) throw new ApiError(404, 'Payment not found for this booking');
  if (payment.user.toString() !== req.user!._id.toString()) throw new ApiError(403, 'Access denied');
  res.status(200).json({ success: true, payment });
});

export const getMyPayments = asyncHandler(async (req: AuthRequest, res: Response) => {
  const payments = await Payment.find({ user: req.user!._id })
    .populate({ path: 'booking', populate: { path: 'vehicle', select: 'title type' } })
    .sort({ createdAt: -1 });
  res.status(200).json({ success: true, payments });
});
