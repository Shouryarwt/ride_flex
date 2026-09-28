import { Response } from 'express';
import { User } from '../models/User.model.js';
import { Dealer } from '../models/Dealer.model.js';
import { Vehicle } from '../models/Vehicle.model.js';
import { Booking } from '../models/Booking.model.js';
import { Payment } from '../models/Payment.model.js';
import { Review } from '../models/Review.model.js';
import { AuthRequest } from '../types/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAdminOverview = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const [
    users,
    sellers,
    dealersPending,
    dealersApproved,
    vehicles,
    vehiclesPending,
    bookings,
    bookingsActive,
    payments,
    revenue,
    reviews,
  ] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'seller' }),
    Dealer.countDocuments({ approvalStatus: 'pending' }),
    Dealer.countDocuments({ approvalStatus: 'approved' }),
    Vehicle.countDocuments(),
    Vehicle.countDocuments({ verificationStatus: 'pending' }),
    Booking.countDocuments(),
    Booking.countDocuments({ bookingStatus: { $in: ['pending', 'confirmed'] } }),
    Payment.countDocuments({ status: 'success' }),
    Payment.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Review.countDocuments(),
  ]);

  res.json({
    success: true,
    metrics: {
      users,
      sellers,
      dealersPending,
      dealersApproved,
      vehicles,
      vehiclesPending,
      bookings,
      bookingsActive,
      successfulPayments: payments,
      reviews,
      revenue: Number(revenue[0]?.total || 0),
    },
  });
});


export const getPendingUsers = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const users = await User.find({ role: 'user', isVerified: false })
    .select('name email mobile city dlNumber isVerified createdAt')
    .sort({ createdAt: -1 })
    .limit(200);
  res.json({ success: true, users });
});

export const verifyUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findOne({ _id: req.params.id, role: 'user' });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  if (!user.dlNumber) return res.status(400).json({ success: false, message: 'Driving license number is missing' });
  user.isVerified = true;
  await user.save();
  res.json({ success: true, message: 'Driving credentials verified', user });
});
