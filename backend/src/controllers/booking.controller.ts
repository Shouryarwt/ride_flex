import { Response } from 'express';
import { Booking } from '../models/Booking.model.js';
import { Vehicle } from '../models/Vehicle.model.js';
import { AuthRequest } from '../types/index.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { vehicleId, startDate, endDate, totalHours, totalAmount } = req.body;

  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle || !vehicle.isActive) {
    throw new ApiError(404, 'Vehicle not found or not available');
  }

  // Check for overlapping bookings
  const overlappingBooking = await Booking.findOne({
    vehicle: vehicleId,
    bookingStatus: { $in: ['pending', 'confirmed'] },
    $or: [
      { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } },
    ],
  });

  if (overlappingBooking) {
    throw new ApiError(409, 'Vehicle is already booked for the selected dates');
  }

  const booking = await Booking.create({
    user: req.user!._id,
    vehicle: vehicleId,
    startDate,
    endDate,
    totalHours,
    totalAmount,
  });

  await booking.populate('vehicle', 'title type pricePerHour pricePerDay');

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    booking,
  });
});

export const getMyBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
  const bookings = await Booking.find({ user: req.user!._id })
    .populate('vehicle', 'title type images city pricePerHour pricePerDay')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    bookings,
  });
});

export const getBookingById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const booking = await Booking.findById(req.params.id)
    .populate('vehicle')
    .populate('user', 'name email mobile');

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  // Check if user owns the booking or is the vehicle seller
  const vehicle = await Vehicle.findById(booking.vehicle);
  if (
    booking.user.toString() !== req.user!._id.toString() &&
    vehicle?.seller.toString() !== req.user!._id.toString()
  ) {
    throw new ApiError(403, 'Access denied');
  }

  res.status(200).json({
    success: true,
    booking,
  });
});

export const updateBookingStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  
  const booking = await Booking.findById(req.params.id).populate('vehicle');

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  const vehicle = await Vehicle.findById(booking.vehicle);
  
  // Only vehicle owner can update booking status
  if (vehicle?.seller.toString() !== req.user!._id.toString()) {
    throw new ApiError(403, 'Only vehicle owner can update booking status');
  }

  booking.bookingStatus = status;
  await booking.save();

  res.status(200).json({
    success: true,
    message: 'Booking status updated successfully',
    booking,
  });
});

export const cancelBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking.user.toString() !== req.user!._id.toString()) {
    throw new ApiError(403, 'You can only cancel your own bookings');
  }

  if (booking.bookingStatus === 'completed') {
    throw new ApiError(400, 'Cannot cancel completed booking');
  }

  booking.bookingStatus = 'cancelled';
  await booking.save();

  res.status(200).json({
    success: true,
    message: 'Booking cancelled successfully',
    booking,
  });
});

export const getSellerBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Get all vehicles owned by the seller
  const vehicles = await Vehicle.find({ seller: req.user!._id });
  const vehicleIds = vehicles.map(v => v._id);

  const bookings = await Booking.find({ vehicle: { $in: vehicleIds } })
    .populate('vehicle', 'title type images')
    .populate('user', 'name email mobile')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    bookings,
  });
});
