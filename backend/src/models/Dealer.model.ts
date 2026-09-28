import mongoose, { Schema } from 'mongoose';
import { IDealer } from '../types/index.js';

const dealerSchema = new Schema<IDealer>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    gstNumber: {
      type: String,
      required: [true, 'GST number is required'],
      unique: true,
      uppercase: true,
      trim: true,
      match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST number format'],
    },
    shopName: {
      type: String,
      required: [true, 'Shop name is required'],
      trim: true,
    },
    ownerName: { type: String, trim: true },
    businessType: {
      type: String,
      enum: ['Individual', 'Partnership', 'Private Ltd / LLP'],
    },
    panNumber: { type: String, trim: true, uppercase: true },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    street: { type: String, trim: true },
    area: { type: String, trim: true },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: { type: String, trim: true },
    serviceRadius: { type: Number, min: 0 },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true,
      match: [/^[0-9]{6}$/, 'Please provide a valid 6-digit pincode'],
    },
    bankName: {
      type: String,
      required: [true, 'Bank name is required'],
      trim: true,
    },
    accountHolder: { type: String, trim: true },
    accountNo: {
      type: String,
      required: [true, 'Account number is required'],
      trim: true,
    },
    ifsc: {
      type: String,
      required: [true, 'IFSC code is required'],
      uppercase: true,
      trim: true,
      match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format'],
    },
    upi: { type: String, trim: true },
    deliveryAvailable: { type: Boolean, default: false },
    deliveryChargePerKm: { type: Number, min: 0, default: 0 },
    openingTime: { type: String, trim: true },
    closingTime: { type: String, trim: true },
    pricePerDay: { type: Number, min: 0 },
    securityDeposit: { type: Number, min: 0, default: 0 },
    idProof: { type: String },
    gstProof: { type: String },
    shopLicense: { type: String },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    officialVerificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    officialVerificationCheckedAt: { type: Date },
    officialVerificationSource: { type: String },
    officialVerificationReference: { type: String },
    officialVerificationNotes: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

dealerSchema.index({ gstNumber: 1 }, { unique: true, name: 'dealer_gst_unique' });
dealerSchema.index({ user: 1 });
dealerSchema.index({ city: 1, approvalStatus: 1 });

export const Dealer = mongoose.model<IDealer>('Dealer', dealerSchema);
