import { Response } from 'express';
import { Vehicle } from '../models/Vehicle.model.js';
import { Dealer } from '../models/Dealer.model.js';
import { AuthRequest } from '../types/index.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const MAX_PDF_BYTES = 10 * 1024 * 1024;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const DAY_MS = 24 * 60 * 60 * 1000;

const startOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

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

const validateImage = (image: string | undefined, label: string) => {
  if (!image) {
    throw new ApiError(400, `${label} is required`);
  }

  if (!/^data:image\//i.test(image)) {
    throw new ApiError(400, `${label} must be an image file`);
  }

  if (getDataUrlByteLength(image) > MAX_IMAGE_BYTES) {
    throw new ApiError(400, `${label} must be under 5MB`);
  }
};

const parseDateOnly = (value: string | Date | undefined) => {
  if (!value) return null;
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const daysUntil = (value: string | Date | undefined) => {
  const date = parseDateOnly(value);
  if (!date) return null;
  return Math.ceil((date.getTime() - startOfToday().getTime()) / DAY_MS);
};

const isExpired = (value: string | Date | undefined) => {
  const days = daysUntil(value);
  return days !== null && days < 0;
};

const buildDocumentAlerts = (vehicle: any) => {
  const checks = [
    { type: 'insurance', label: 'Insurance', expiry: vehicle.insuranceExpiry },
    { type: 'pollution', label: 'Pollution certificate', expiry: vehicle.pollutionExpiry },
  ];

  return checks
    .map((check) => ({ ...check, daysRemaining: daysUntil(check.expiry) }))
    .filter((check) => check.daysRemaining !== null && check.daysRemaining <= 5)
    .map((check) => ({
      type: check.type,
      daysRemaining: check.daysRemaining,
      message:
        check.daysRemaining! < 0
          ? `${check.label} expired. Renew it to reactivate this vehicle.`
          : `${check.label} will expire in ${check.daysRemaining} day(s). Renew it within 5 days.`,
    }));
};

const hasExpiredCompliance = (vehicle: any) =>
  isExpired(vehicle.insuranceExpiry) || isExpired(vehicle.pollutionExpiry);

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

const sanitizePublicVehicle = (vehicle: any) => {
  const data = vehicle.toObject ? vehicle.toObject() : { ...vehicle };
  delete data.rcDocument;
  delete data.insuranceDocument;
  delete data.pollutionDocument;
  return data;
};

const withDocumentAlerts = (vehicle: any) => {
  const data = vehicle.toObject ? vehicle.toObject() : { ...vehicle };
  data.documentAlerts = buildDocumentAlerts(data);
  return data;
};

const validateVehiclePayload = (payload: any) => {
  if (payload.rcNumber) {
    payload.rcNumber = String(payload.rcNumber).toUpperCase();
  }

  if (!/^[A-Z0-9]{10}$/.test(payload.rcNumber || '')) {
    throw new ApiError(400, 'RC number must be exactly 10 uppercase letters/numbers');
  }

  const today = startOfToday();
  const availableFrom = parseDateOnly(payload.availableFrom);
  const availableTo = parseDateOnly(payload.availableTo);
  const insuranceStartDate = parseDateOnly(payload.insuranceStartDate);
  const insuranceExpiry = parseDateOnly(payload.insuranceExpiry);
  const pollutionStartDate = parseDateOnly(payload.pollutionStartDate);
  const pollutionExpiry = parseDateOnly(payload.pollutionExpiry);

  if (availableFrom && availableFrom < today) {
    throw new ApiError(400, 'Available from date cannot be in the past');
  }
  if (availableTo && availableFrom && availableTo < availableFrom) {
    throw new ApiError(400, 'Available to date cannot be before available from date');
  }
  if (!insuranceStartDate || !insuranceExpiry) {
    throw new ApiError(400, 'Insurance start and end dates are required');
  }
  if (!pollutionStartDate || !pollutionExpiry) {
    throw new ApiError(400, 'Pollution start and end dates are required');
  }
  if (insuranceExpiry < insuranceStartDate) {
    throw new ApiError(400, 'Insurance end date cannot be before start date');
  }
  if (pollutionExpiry < pollutionStartDate) {
    throw new ApiError(400, 'Pollution end date cannot be before start date');
  }

  validatePdfDocument(payload.rcDocument, 'RC document');
  validatePdfDocument(payload.insuranceDocument, 'Insurance document');
  validatePdfDocument(payload.pollutionDocument, 'Pollution document');

  if (!Array.isArray(payload.images) || payload.images.length < 4) {
    throw new ApiError(400, 'Front, back, right, and left vehicle images are required');
  }

  ['front image', 'back image', 'right image', 'left image'].forEach((label, index) => {
    validateImage(payload.images[index], `Vehicle ${label}`);
  });
};

export const createVehicle = asyncHandler(async (req: AuthRequest, res: Response) => {
  const dealer = await Dealer.findOne({ user: req.user!._id });

  if (!dealer) {
    throw new ApiError(404, 'Dealer profile not found. Please complete your dealer registration.');
  }

  if (dealer.approvalStatus === 'rejected') {
    throw new ApiError(403, 'Your dealer account has been rejected. Please contact support.');
  }

  validateVehiclePayload(req.body);

  const vehicle = await Vehicle.create({
    ...req.body,
    seller: req.user!._id,
    dealer: dealer._id,
    // Vehicles become bookable only after the dealer is approved.
    // (Customers see vehicles only when isActive === true)
    isActive: dealer.approvalStatus === 'approved' && !hasExpiredCompliance(req.body),
  });

  res.status(201).json({
    success: true,
    message: 'Vehicle created successfully',
    vehicle,
  });
});

export const getVehicles = asyncHandler(async (req: AuthRequest, res: Response) => {
  await deactivateExpiredVehicles();

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
    .select('-rcDocument -insuranceDocument -pollutionDocument')
    .populate('seller', 'name email mobile')
    .populate('dealer', 'shopName city address')
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Vehicle.countDocuments(query);

  res.status(200).json({
    success: true,
    vehicles: vehicles.map(sanitizePublicVehicle),
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

export const getVehicleById = asyncHandler(async (req: AuthRequest, res: Response) => {
  await deactivateExpiredVehicles();

  const vehicle = await Vehicle.findOne({ _id: req.params.id, isActive: true })
    .select('-rcDocument -insuranceDocument -pollutionDocument')
    .populate('seller', 'name email mobile')
    .populate('dealer', 'shopName city address');

  if (!vehicle) {
    throw new ApiError(404, 'Vehicle not found');
  }

  res.status(200).json({
    success: true,
    vehicle: sanitizePublicVehicle(vehicle),
  });
});

export const getMyVehicles = asyncHandler(async (req: AuthRequest, res: Response) => {
  await deactivateExpiredVehicles();

  const vehicles = await Vehicle.find({ seller: req.user!._id })
    .populate('dealer', 'shopName city')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    vehicles: vehicles.map(withDocumentAlerts),
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

  validateVehiclePayload({ ...vehicle.toObject(), ...req.body });

  Object.assign(vehicle, req.body);
  const dealer = await Dealer.findById(vehicle.dealer);
  vehicle.isActive = dealer?.approvalStatus === 'approved' && !hasExpiredCompliance(vehicle);
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
