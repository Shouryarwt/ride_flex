const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

const createPaymentOrder = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: 'bookingId is required' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed for this booking' });
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Booking already paid' });
    }

    const orderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    const payment = await Payment.create({
      booking: booking._id,
      user: req.user._id,
      amount: booking.totalAmount,
      orderId,
      status: 'created',
    });

    return res.status(201).json({
      message: 'Payment order created',
      payment,
    });
  } catch (error) {
    return next(error);
  }
};

const markPaymentStatus = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const { status, transactionId } = req.body;

    if (!['paid', 'failed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed for this payment' });
    }

    payment.status = status;
    if (transactionId) {
      payment.transactionId = transactionId;
    }
    await payment.save();

    if (status === 'paid') {
      await Booking.findByIdAndUpdate(payment.booking, { paymentStatus: 'paid' });
    }

    return res.status(200).json({ message: 'Payment updated', payment });
  } catch (error) {
    return next(error);
  }
};

const getMyPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user._id }).populate('booking');
    return res.status(200).json({ count: payments.length, payments });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createPaymentOrder,
  markPaymentStatus,
  getMyPayments,
};
