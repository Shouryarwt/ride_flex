import { Response } from 'express';
import { Dealer } from '../models/Dealer.model.js';
import { AuthRequest } from '../types/index.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDealerProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const dealer = await Dealer.findOne({ user: req.user!._id }).populate('user', 'name email mobile');

  if (!dealer) {
    throw new ApiError(404, 'Dealer profile not found');
  }

  res.status(200).json({
    success: true,
    dealer,
  });
});

export const updateDealerProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { shopName, address, city, bankName, accountNo, ifsc } = req.body;

  const dealer = await Dealer.findOne({ user: req.user!._id });

  if (!dealer) {
    throw new ApiError(404, 'Dealer profile not found');
  }

  Object.assign(dealer, { shopName, address, city, bankName, accountNo, ifsc });
  await dealer.save();

  res.status(200).json({
    success: true,
    message: 'Dealer profile updated successfully',
    dealer,
  });
});

export const getAllDealers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { city, approvalStatus } = req.query;

  const query: any = {};
  if (city) query.city = city;
  if (approvalStatus) query.approvalStatus = approvalStatus;

  const dealers = await Dealer.find(query)
    .populate('user', 'name email mobile')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    dealers,
  });
});

export const approveDealerStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    throw new ApiError(400, 'Invalid status. Must be approved or rejected');
  }

  const dealer = await Dealer.findById(req.params.id);

  if (!dealer) {
    throw new ApiError(404, 'Dealer not found');
  }

  dealer.approvalStatus = status;
  await dealer.save();

  res.status(200).json({
    success: true,
    message: `Dealer ${status} successfully`,
    dealer,
  });
});
