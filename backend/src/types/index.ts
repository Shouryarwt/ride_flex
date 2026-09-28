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
  shopLicense?: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  officialVerificationStatus?: 'pending' | 'verified' | 'rejected';
  officialVerificationCheckedAt?: Date;
  officialVerificationSource?: string;
  officialVerificationReference?: string;
  officialVerificationNotes?: string;
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
  insuranceStartDate: Date;
  insuranceExpiry: Date;
  insuranceDocument?: string;
  pollutionStartDate: Date;
  pollutionExpiry: Date;
  pollutionDocument?: string;
  rcDocument?: string;
  availableFrom?: Date;
  availableTo?: Date;
  weekendPrice?: number;
  holidayPrice?: number;
  minDuration?: number;
  pricePerHour: number;
  pricePerDay: number;
  deliveryAvailable: boolean;
  deliveryChargePerKm: number;
  securityDeposit: number;
  isActive: boolean;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  publishedAt?: Date;
}

export interface IBooking extends Document {
  user: IUser['_id'];
  vehicle: IVehicle['_id'];
  startDate: Date;
  endDate: Date;
  totalHours: number;
  rentalSubtotal: number;
  platformFee: number;
  deliveryFee: number;
  securityDeposit: number;
  totalAmount: number;
  pickupOption: 'pickup' | 'delivery';
  deliveryAddress?: string;
  deliveryDistanceKm?: number;
  paymentStatus: 'pending' | 'authorized' | 'paid' | 'failed' | 'refunded';
  paymentProvider: 'razorpay' | 'phonepe';
  paymentOrderId?: string;
  paymentTransactionId?: string;
  bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'rejected' | 'completed';
}

export interface IPayment extends Document {
  booking: IBooking['_id'];
  user: IUser['_id'];
  amount: number;
  paymentMethod: 'card' | 'upi' | 'netbanking' | 'wallet';
  transactionId: string;
  status: 'pending' | 'success' | 'failed' | 'refunded';
}

export interface AuthRequest extends Request {
  user?: IUser;
}
