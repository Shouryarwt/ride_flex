import mongoose, { Schema } from 'mongoose';
import { IBooking } from '../types/index.js';

const bookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    totalHours: {
      type: Number,
      required: [true, 'Total hours is required'],
      min: [1, 'Booking must be at least 1 hour'],
    },
    rentalSubtotal: {
      type: Number,
      min: 0,
      required: [true, 'Rental subtotal is required'],
    },
    platformFee: {
      type: Number,
      min: 0,
      default: 0,
    },
    deliveryFee: {
      type: Number,
      min: 0,
      default: 0,
    },
    securityDeposit: {
      type: Number,
      min: 0,
      default: 0,
    },
    pickupOption: {
      type: String,
      enum: ['pickup', 'delivery'],
      default: 'pickup',
    },
    deliveryAddress: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    deliveryDistanceKm: {
      type: Number,
      min: 0,
      max: 1000,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'authorized', 'paid', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    paymentProvider: {
      type: String,
      enum: ['razorpay', 'phonepe'],
      default: 'razorpay',
    },
    paymentOrderId: { type: String, trim: true },
    paymentTransactionId: { type: String, trim: true },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'rejected', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ vehicle: 1, startDate: 1, endDate: 1 });
bookingSchema.index({ bookingStatus: 1, paymentStatus: 1 });

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
