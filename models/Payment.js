const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    provider: {
      type: String,
      default: 'placeholder_gateway',
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    transactionId: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['created', 'paid', 'failed'],
      default: 'created',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
