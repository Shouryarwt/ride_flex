import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { User } from '../models/User.model.js';
import { Dealer } from '../models/Dealer.model.js';
import { Vehicle } from '../models/Vehicle.model.js';
import { Booking } from '../models/Booking.model.js';
import { Payment } from '../models/Payment.model.js';

import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateToken } from '../utils/jwt.js';

const sanitizeDealer = (dealer: any) => {
  if (!dealer) return null;
  const { _id, gstNumber, shopName, address, city, pincode, bankName, accountNo, ifsc, approvalStatus, isActive, createdAt, updatedAt } = dealer;
  return {
    id: _id,
    gstNumber,
    shopName,
    address,
    city,
    pincode,
    bankName,
    accountNo,
    ifsc,
    approvalStatus,
    isActive,
    createdAt,
    updatedAt,
  };
};

const MAX_PDF_BYTES = 10 * 1024 * 1024;

const getDataUrlByteLength = (dataUrl: string) => {
  const base64 = dataUrl.split(',')[1] || '';
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  return Math.ceil((base64.length * 3) / 4) - padding;
};

const validatePdfDocument = (document: string | undefined, label: string) => {
  if (!document) {
    throw new ApiError(400, `${label} is required`);
  }

  if (!/^data:application\/pdf;base64,/i.test(document)) {
    throw new ApiError(400, `${label} must be a PDF file`);
  }

  if (getDataUrlByteLength(document) > MAX_PDF_BYTES) {
    throw new ApiError(400, `${label} must be under 10MB`);
  }
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { 
    name, email, mobile, password, role, city, dlNumber, profilePic,
    gstNumber, shopName, address, pincode, bankName, accountNo, ifsc, idProof, gstProof 
  } = req.body;

  // Basic validation
  if (!name || !email || !mobile || !password) {
    throw new ApiError(400, 'Name, email, mobile, and password are required');
  }

  // Validate seller-specific fields
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  const normalizedGstNumber = gstNumber?.toUpperCase();
  const normalizedIfsc = ifsc?.toUpperCase();

  if (role === 'seller') {
    if (!gstNumber || !shopName || !address || !city || !pincode || !bankName || !accountNo || !ifsc) {
      throw new ApiError(400, 'All dealer fields (GST, shop name, address, city, pincode, bank details, IFSC) are required for sellers');
    }
    if (!gstRegex.test(normalizedGstNumber)) {
      throw new ApiError(400, 'Invalid GST number format');
    }
    if (!/^[0-9]{6}$/.test(pincode)) {
      throw new ApiError(400, 'Please provide a valid 6-digit pincode');
    }

    validatePdfDocument(idProof, 'Government ID proof');
    validatePdfDocument(gstProof, 'GST certificate / shop license');
  }

  // Check if user already exists
  const existingUser = await User.findOne({ 
    $or: [{ email }, { mobile }] 
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new ApiError(409, 'Email already registered');
    }
    if (existingUser.mobile === mobile) {
      throw new ApiError(409, 'Mobile number already registered');
    }
  }

  // For sellers, check GST uniqueness
  if (role === 'seller' && gstNumber) {
    const existingDealer = await Dealer.findOne({ gstNumber: normalizedGstNumber });
    if (existingDealer) {
      throw new ApiError(409, 'GST number already registered by another dealer');
    }
  }

  let user;
  let dealer = null;

  try {
    user = await User.create({
      name,
      email,
      mobile,
      password,
      role: role || 'user',
      city,
      dlNumber,
      profilePic,
      isVerified: false,
    });

    if (role === 'seller') {
      dealer = await Dealer.create({
        user: user._id,
        gstNumber: normalizedGstNumber,
        shopName,
        address,
        city: city || '',
        pincode,
        bankName,
        accountNo,
        ifsc: normalizedIfsc,
        idProof,
        gstProof,
        approvalStatus: 'pending',
      });
    }
  } catch (error) {
    if (user) {
      await User.findByIdAndDelete(user._id);
    }
    throw error;
  }

  const token = generateToken({ id: user._id.toString(), role: user.role });

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      city: user.city,
      isVerified: user.isVerified,
      ...(dealer && { dealer: sanitizeDealer(dealer) }),
    },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { identifier, password, role } = req.body;

  if (!identifier || !password) {
    throw new ApiError(400, 'Email/Mobile and password are required');
  }

  // Find user by email or mobile
  const user = await User.findOne({
    $or: [{ email: identifier }, { mobile: identifier }],
  }).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // Check role match if provided
  if (role && user.role !== role && user.role !== 'admin') {
    throw new ApiError(401, 'Invalid credentials or role mismatch');
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const dealerInfo = user.role === 'seller' ? await Dealer.findOne({ user: user._id }) : null;
  const token = generateToken({ id: user._id.toString(), role: user.role });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      isVerified: user.isVerified,
      city: user.city,
      ...(dealerInfo && { dealer: sanitizeDealer(dealerInfo) }),
    },
  });
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById((req as any).user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  let dealerInfo = null;
  if (user.role === 'seller') {
    dealerInfo = await Dealer.findOne({ user: user._id });
  }

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      city: user.city,
      dlNumber: user.dlNumber,
      profilePic: user.profilePic,
      isVerified: user.isVerified,
      ...(dealerInfo && { dealer: sanitizeDealer(dealerInfo) }),
    },
  });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const { name, city, dlNumber, profilePic } = req.body;
  
  const user = await User.findByIdAndUpdate(
    (req as any).user._id,
    { name, city, dlNumber, profilePic },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user,
  });
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById((req as any).user._id).select('+password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isPasswordValid = await user.comparePassword(currentPassword);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});

export const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
  const requester = (req as any).user as any;
  const requesterId = requester?._id || requester?.id;

  if (!requesterId) {
    throw new ApiError(401, 'Authentication required');
  }

  // Block deletion of any admin user (including self)
  if (requester.role === 'admin') {
    throw new ApiError(403, 'Admin accounts cannot be deleted');
  }

  const userId = requesterId;



  // Seller: delete their dealer record (unique on Dealer.user)
  const dealer = await Dealer.findOne({ user: userId });

  // Vehicles and dependent data
  // Vehicle.seller references User (seller) and Vehicle.dealer references Dealer.
  const sellerVehicles = await Vehicle.find({ seller: userId });
  const vehicleIds = sellerVehicles.map((v: any) => v._id);

  const bookings = await Booking.find({ user: userId });
  const bookingIds = bookings.map((b: any) => b._id);

  await Payment.deleteMany({ $or: [{ user: userId }, { booking: { $in: bookingIds } }] });
  await Booking.deleteMany({ _id: { $in: bookingIds } });

  await Vehicle.deleteMany({ _id: { $in: vehicleIds } });

  // If seller had a dealer record, delete it
  if (dealer) {
    await dealer.deleteOne();
  }

  // Finally delete the user
  await User.findByIdAndDelete(userId);

  // Logout is handled on the frontend
  res.status(200).json({ success: true, message: 'Account deleted successfully' });
});


