import { Request, Response } from 'express';
import { User } from '../models/User.model.js';
import { Dealer } from '../models/Dealer.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateToken } from '../utils/jwt.js';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { 
    name, email, mobile, password, role, city, dlNumber, profilePic,
    gstNumber, shopName, address, bankName, accountNo, ifsc, idProof, gstProof 
  } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ 
    $or: [{ email }, { mobile }] 
  });

  if (existingUser) {
    throw new ApiError(409, 'User with this email or mobile already exists');
  }

  // For sellers, check GST uniqueness
  if (role === 'seller' && gstNumber) {
    const existingDealer = await Dealer.findOne({ gstNumber });
    if (existingDealer) {
      throw new ApiError(409, 'A dealer with this GST number already exists');
    }
  }

  // Create user
  const user = await User.create({
    name,
    email,
    mobile,
    password,
    role: role || 'user',
    city,
    dlNumber,
    profilePic,
    isVerified: role === 'user' ? false : false, // Sellers need approval
  });

  // If seller, create dealer profile
  if (role === 'seller') {
    await Dealer.create({
      user: user._id,
      gstNumber,
      shopName,
      address,
      city: city || '',
      bankName,
      accountNo,
      ifsc,
      idProof,
      gstProof,
      approvalStatus: 'pending',
    });
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
      isVerified: user.isVerified,
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
  if (role && user.role !== role) {
    throw new ApiError(401, 'Invalid credentials or role mismatch');
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

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
      ...(dealerInfo && { dealer: dealerInfo }),
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
