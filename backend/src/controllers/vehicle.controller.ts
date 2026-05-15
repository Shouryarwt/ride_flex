import { Response } from 'express';
import { Vehicle } from '../models/Vehicle.model.js';
import { Dealer } from '../models/Dealer.model.js';
import { AuthRequest } from '../types/index.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createVehicle = asyncHandler(async (req: AuthRequest, res: Response) => {
  const dealer = await Dealer.findOne({ user: req.user!._id });

  if (!dealer) {
    throw new ApiError(404, 'Dealer profile not found. Please complete your dealer registration.');
  }

  if (dealer.approvalStatus !== 'approved') {
    throw new ApiError(403, 'Your dealer account is not approved yet. Please wait for admin approval.');
  }

  const vehicle = await Vehicle.create({
    ...req.body,
    seller: req.user!._id,
    dealer: dealer._id,
  });

  res.status(201).json({
    success: true,
    message: 'Vehicle created successfully',
    vehicle,
  });
});

export const getVehicles = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { city, type, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

  const query: any = { isActive: true };

  if (city) query.city = city;
  if (type) query.type = type;
  if (minPrice || maxPrice) {
    query.pricePerDay = {};
    if (minPrice) query.pricePerDay.$gte = Number(minPrice);
    if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const vehicles = await Vehicle.find(query)
    .populate('seller', 'name email mobile')
    .populate('dealer', 'shopName city address')
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Vehicle.countDocuments(query);

  res.status(200).json({
    success: true,
    vehicles,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

export const getVehicleById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const vehicle = await Vehicle.findById(req.params.id)
    .populate('seller', 'name email mobile')
    .populate('dealer', 'shopName city address');

  if (!vehicle) {
    throw new ApiError(404, 'Vehicle not found');
  }

  res.status(200).json({
    success: true,
    vehicle,
  });
});

export const getMyVehicles = asyncHandler(async (req: AuthRequest, res: Response) => {
  const vehicles = await Vehicle.find({ seller: req.user!._id })
    .populate('dealer', 'shopName city')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    vehicles,
  });
});

export const updateVehicle = asyncHandler(async (req: AuthRequest, res: Response) => {
  const vehicle = await Vehicle.findOne({ 
    _id: req.params.id, 
    seller: req.user!._id 
  });

  if (!vehicle) {
    throw new ApiError(404, 'Vehicle not found or you do not have permission to update it');
  }

  Object.assign(vehicle, req.body);
  await vehicle.save();

  res.status(200).json({
    success: true,
    message: 'Vehicle updated successfully',
    vehicle,
  });
});

export const deleteVehicle = asyncHandler(async (req: AuthRequest, res: Response) => {
  const vehicle = await Vehicle.findOne({ 
    _id: req.params.id, 
    seller: req.user!._id 
  });

  if (!vehicle) {
    throw new ApiError(404, 'Vehicle not found or you do not have permission to delete it');
  }

  await vehicle.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Vehicle deleted successfully',
  });
});
