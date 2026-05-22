import { Response } from 'express';
import { Booking } from '../models/Booking.model.js';
import { Vehicle } from '../models/Vehicle.model.js';
import { Notification } from '../models/Notification.model.js';
import { AuthRequest } from '../types/index.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const startOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const isExpired = (value: Date | undefined) => {
  if (!value) return false;
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date < startOfToday();
};

const deactivateExpiredVehicles = async () => {
  const today = startOfToday();
  await Vehicle.updateMany(
    {
      isActive: true,
      $or: [
        { insuranceExpiry: { $lt: today } },
        { pollutionExpiry: { $lt: today } },
      ],
    },
    { isActive: false }
  );
};

export const createBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { vehicleId, startDate, endDate, totalHours, totalAmount } = req.body;

  await deactivateExpiredVehicles();

  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle || !vehicle.isActive) {
    throw new ApiError(404, 'Vehicle not found or not available');
  }

  if (isExpired(vehicle.insuranceExpiry) || isExpired(vehicle.pollutionExpiry)) {
    vehicle.isActive = false;
    await vehicle.save();
    throw new ApiError(400, 'Vehicle documents are expired and the vehicle is not bookable');
  }

  if (new Date(startDate) < startOfToday()) {
    throw new ApiError(400, 'Booking start date cannot be in the past');
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

  await booking.populate('vehicle', 'title type pricePerHour pricePerDay seller');
  const populatedVehicle = booking.vehicle as any;

  if (populatedVehicle && typeof populatedVehicle !== 'string') {
    await Notification.create({
      recipient: populatedVehicle.seller,
      booking: booking._id,
      type: 'booking_request',
      message: `New booking request for ${populatedVehicle.title} from ${req.user?.name || 'a customer'}`,
    });
  }

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    booking,
  });
});

export const getMyBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
  const bookings = await Booking.find({ user: req.user!._id })
    .populate({
      path: 'vehicle',
      select: 'title type images city pricePerHour pricePerDay dealer',
      populate: [
        { path: 'dealer', select: 'shopName gstNumber' },
      ],
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    bookings,
  });
});


export const getBookingById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const booking = await Booking.findById(req.params.id)
    .populate('vehicle', '-rcDocument -insuranceDocument -pollutionDocument')
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

export const getVehicleBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
  const vehicleId = req.params.vehicleId;
  const today = startOfToday();

  const bookings = await Booking.find({
    vehicle: vehicleId,
    bookingStatus: { $in: ['pending', 'confirmed'] },
    endDate: { $gte: today },
  })
    .populate('user', 'name email')
    .sort({ startDate: 1 });

  res.status(200).json({
    success: true,
    bookings,
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

  const bookedVehicle = booking.vehicle as any;

  if (status === 'confirmed') {
    await Notification.create({
      recipient: booking.user,
      booking: booking._id,
      type: 'booking_confirmed',
      message: `Your booking for ${bookedVehicle?.title || 'the vehicle'} has been approved.`,
    });
  } else if (status === 'rejected') {
    await Notification.create({
      recipient: booking.user,
      booking: booking._id,
      type: 'booking_cancelled',
      message: `Your booking for ${bookedVehicle?.title || 'the vehicle'} was rejected by the dealer.`,
    });
  } else if (status === 'cancelled') {
    await Notification.create({
      recipient: booking.user,
      booking: booking._id,
      type: 'booking_cancelled',
      message: `Your booking for ${bookedVehicle?.title || 'the vehicle'} was cancelled.`,
    });
  }

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
