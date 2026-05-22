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
  pincode: string;
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
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'CNG';
  transmission: 'Manual' | 'Automatic';
  seatingCapacity: number;
  engineSegment: string;
  city: string;
  images: string[];
  rcNumber: string;
  rcDocument?: string;
  insuranceExpiry: Date;
  insuranceStartDate?: Date;
  insuranceDocument?: string;
  pollutionExpiry: Date;
  pollutionStartDate?: Date;
  pollutionDocument?: string;
  pricePerHour: number;
  pricePerDay: number;
  deliveryAvailable: boolean;
  deliveryChargePerKm: number;
  availableFrom?: Date;
  availableTo?: Date;
  weekendPrice?: number;
  holidayPrice?: number;
  minDuration?: number;
  isActive: boolean;
}

export interface IBooking extends Document {
  user: IUser['_id'];
  vehicle: IVehicle['_id'];
  startDate: Date;
  endDate: Date;
  totalHours: number;
  totalAmount: number;
  bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'rejected' | 'completed';
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

export interface INotification extends Document {
  recipient: IUser['_id'];
  booking: IBooking['_id'];
  type: 'booking_request' | 'booking_confirmed' | 'booking_cancelled';
  message: string;
  read: boolean;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

