import { Request } from 'express';
import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: 'user' | 'seller' | 'admin';
  city?: string;
  dlNumber?: string;
  profilePic?: string;
  isVerified: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IDealer extends Document {
  user: IUser['_id'];
  gstNumber: string;
  shopName: string;
  ownerName?: string;
  businessType?: 'Individual' | 'Partnership' | 'Private Ltd / LLP';
  panNumber?: string;
  address: string;
  street?: string;
  area?: string;
  city: string;
  state?: string;
  pincode: string;
  serviceRadius?: number;
  bankName: string;
  accountHolder?: string;
  accountNo: string;
  ifsc: string;
  upi?: string;
  deliveryAvailable?: boolean;
  deliveryChargePerKm?: number;
  openingTime?: string;
  closingTime?: string;
  pricePerDay?: number;
  securityDeposit?: number;
  idProof?: string;
  gstProof?: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
}
