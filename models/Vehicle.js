const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dealer',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['bike', 'scooter', 'car'],
      required: true,
    },
    engineSegment: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    images: [{ type: String, trim: true }],
    pricePerHour: {
      type: Number,
      required: true,
      min: 0,
    },
    pricePerDay: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryAvailable: {
      type: Boolean,
      default: false,
    },
    deliveryChargePerKm: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
