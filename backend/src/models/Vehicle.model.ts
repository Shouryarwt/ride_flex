import mongoose, { Schema } from 'mongoose';
import { IVehicle } from '../types/index.js';

const vehicleSchema = new Schema<IVehicle>(
  {
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dealer: {
      type: Schema.Types.ObjectId,
      ref: 'Dealer',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Vehicle title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['bike', 'scooter', 'car'],
      required: [true, 'Vehicle type is required'],
    },
    engineSegment: {
      type: String,
      required: [true, 'Engine segment is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    images: [{
      type: String,
      trim: true,
    }],
    pricePerHour: {
      type: Number,
      required: [true, 'Price per hour is required'],
      min: [0, 'Price cannot be negative'],
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Price per day is required'],
      min: [0, 'Price cannot be negative'],
    },
    deliveryAvailable: {
      type: Boolean,
      default: false,
    },
    deliveryChargePerKm: {
      type: Number,
      default: 0,
      min: [0, 'Delivery charge cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

vehicleSchema.index({ seller: 1 });
vehicleSchema.index({ city: 1, type: 1 });
vehicleSchema.index({ isActive: 1 });

export const Vehicle = mongoose.model<IVehicle>('Vehicle', vehicleSchema);
