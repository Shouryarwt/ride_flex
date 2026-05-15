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
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    bankName: {
      type: String,
      required: [true, 'Bank name is required'],
      trim: true,
    },
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
    idProof: {
      type: String,
    },
    gstProof: {
      type: String,
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

dealerSchema.index({ gstNumber: 1 });
dealerSchema.index({ user: 1 });

export const Dealer = mongoose.model<IDealer>('Dealer', dealerSchema);
