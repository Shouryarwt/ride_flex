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
