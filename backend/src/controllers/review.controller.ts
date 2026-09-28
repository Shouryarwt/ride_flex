import { Response } from 'express';
import { Booking } from '../models/Booking.model.js';
import { Review } from '../models/Review.model.js';
import { Vehicle } from '../models/Vehicle.model.js';
import mongoose from 'mongoose';
import { AuthRequest } from '../types/index.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { bookingId, rating, comment } = req.body;
  if (!bookingId) throw new ApiError(400, 'bookingId is required');

  const numericRating = Number(rating);
  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    throw new ApiError(400, 'Rating must be an integer from 1 to 5');
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.user.toString() !== req.user!._id.toString()) {
    throw new ApiError(403, 'You can only review your own booking');
  }
  if (booking.bookingStatus !== 'completed') {
    throw new ApiError(400, 'A review can only be submitted after a completed ride');
  }

  const existing = await Review.findOne({ booking: booking._id });
  if (existing) throw new ApiError(409, 'This booking has already been reviewed');

  const vehicle = await Vehicle.findById(booking.vehicle);
  if (!vehicle) throw new ApiError(404, 'Vehicle not found');

  const review = await Review.create({
    user: req.user!._id,
    booking: booking._id,
    vehicle: vehicle._id,
    rating: numericRating,
    comment: comment ? String(comment).trim() : undefined,
  });

  res.status(201).json({ success: true, message: 'Review submitted successfully', review });
});

export const getVehicleReviews = asyncHandler(async (req: AuthRequest, res: Response) => {
  const vehicleId = req.params.vehicleId;
  const [reviews, aggregate] = await Promise.all([
    Review.find({ vehicle: vehicleId })
      .populate('user', 'name profilePic')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean(),
    Review.aggregate([
      { $match: { vehicle: new mongoose.Types.ObjectId(vehicleId) } },
      { $group: { _id: '$vehicle', average: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]),
  ]);

  const summary = aggregate[0] || { average: 0, count: 0 };
  res.json({
    success: true,
    summary: { average: Number(summary.average || 0).toFixed(1), count: summary.count || 0 },
    reviews,
  });
});
