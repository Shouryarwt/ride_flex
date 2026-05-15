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
  address: string;
  city: string;
  bankName: string;
  accountNo: string;
  ifsc: string;
  idProof?: string;
  gstProof?: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
}

export interface IVehicle extends Document {
  seller: IUser['_id'];
  dealer: IDealer['_id'];
  title: string;
  description?: string;
  type: 'bike' | 'scooter' | 'car';
  engineSegment: string;
  city: string;
  images: string[];
  pricePerHour: number;
  pricePerDay: number;
  deliveryAvailable: boolean;
  deliveryChargePerKm: number;
  isActive: boolean;
}

export interface IBooking extends Document {
  user: IUser['_id'];
  vehicle: IVehicle['_id'];
  startDate: Date;
  endDate: Date;
  totalHours: number;
  totalAmount: number;
  bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'unpaid' | 'paid';
}

export interface IPayment extends Document {
  booking: IBooking['_id'];
  user: IUser['_id'];
  amount: number;
  paymentMethod: 'card' | 'upi' | 'netbanking' | 'wallet';
  transactionId: string;
  status: 'pending' | 'success' | 'failed';
}

export interface AuthRequest extends Request {
  user?: IUser;
}
