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
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Electric', 'CNG'],
      required: [true, 'Fuel type is required'],
      trim: true,
    },
    transmission: {
      type: String,
      enum: ['Manual', 'Automatic'],
      required: [true, 'Transmission type is required'],
      trim: true,
    },
    seatingCapacity: {
      type: Number,
      required: [true, 'Seating capacity is required'],
      min: [1, 'Seating capacity must be at least 1'],
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
    images: {
      type: [{
        type: String,
        trim: true,
      }],
      validate: {
        validator: (images: string[]) => Array.isArray(images) && images.length >= 4,
        message: 'Front, back, right, and left vehicle images are required',
      },
    },
    rcNumber: {
      type: String,
      required: [true, 'RC number is required'],
      uppercase: true,
      trim: true,
      match: [/^[A-Z0-9]{10}$/, 'RC number must be exactly 10 uppercase letters/numbers'],
    },
    insuranceStartDate: {
      type: Date,
      required: [true, 'Insurance start date is required'],
    },
    pollutionStartDate: {
      type: Date,
      required: [true, 'Pollution start date is required'],
    },
    rcDocument: {
      type: String,
    },
    insuranceExpiry: {
      type: Date,
      required: [true, 'Insurance expiry date is required'],
    },
    insuranceDocument: {
      type: String,
    },
    pollutionExpiry: {
      type: Date,
      required: [true, 'Pollution expiry date is required'],
    },
    pollutionDocument: {
      type: String,
    },
    availableFrom: {
      type: Date,
    },
    availableTo: {
      type: Date,
    },

    weekendPrice: {
      type: Number,
      default: 0,
      min: [0, 'Weekend price cannot be negative'],
    },
    holidayPrice: {
      type: Number,
      default: 0,
      min: [0, 'Holiday price cannot be negative'],
    },
    minDuration: {
      type: Number,
      default: 1,
      min: [1, 'Minimum duration must be at least 1 day'],
    },
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
