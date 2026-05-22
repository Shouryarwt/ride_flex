import { Response } from 'express';
import { Favorite } from '../models/Favorite.model.js';
import { Vehicle } from '../models/Vehicle.model.js';
import { AuthRequest } from '../types/index.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';



export const getMyFavorites = asyncHandler(async (req: AuthRequest, res: Response) => {
  const favorites = await Favorite.find({ user: req.user!._id })
    .populate({
      path: 'vehicle',
      select: '-rcDocument -insuranceDocument -pollutionDocument',
      populate: [
        { path: 'dealer', select: 'shopName gstNumber' },
        { path: 'seller', select: 'name email' },
      ],
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    favorites: favorites.map(f => f.vehicle).filter(Boolean),
  });
});

export const addFavorite = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { vehicleId } = req.body;
  if (!vehicleId) throw new ApiError(400, 'vehicleId is required');

  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle || !vehicle.isActive) {
    throw new ApiError(404, 'Vehicle not found or not available');
  }

  const favorite = await Favorite.create({
    user: req.user!._id,
    vehicle: vehicleId,
  });

  await favorite.populate({
    path: 'vehicle',
    select: '-rcDocument -insuranceDocument -pollutionDocument',
    populate: [
      { path: 'dealer', select: 'shopName gstNumber' },
      { path: 'seller', select: 'name email' },
    ],
  });

  res.status(201).json({
    success: true,
    message: 'Added to favorites',
    vehicle: (favorite as any).vehicle,
  });
});

export const removeFavorite = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { vehicleId } = req.params;
  if (!vehicleId) throw new ApiError(400, 'vehicleId is required');

  const deleted = await Favorite.findOneAndDelete({
    user: req.user!._id,
    vehicle: vehicleId,
  });

  if (!deleted) {
    throw new ApiError(404, 'Favorite not found');
  }

  res.status(200).json({
    success: true,
    message: 'Removed from favorites',
  });
});

