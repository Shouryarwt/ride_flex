import { Response } from 'express';
import { Dealer } from '../models/Dealer.model.js';
import { Vehicle } from '../models/Vehicle.model.js';
import { User } from '../models/User.model.js';
import { AuthRequest } from '../types/index.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const sanitizeDealerForSeller = (dealer: any) => {
  const data = dealer.toObject ? dealer.toObject() : { ...dealer };
  delete data.idProof;
  delete data.gstProof;
  return data;
};

export const getDealerProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const dealer = await Dealer.findOne({ user: req.user!._id }).populate('user', 'name email mobile');

  if (!dealer) {
    throw new ApiError(404, 'Dealer profile not found');
  }

  res.status(200).json({
    success: true,
    dealer: sanitizeDealerForSeller(dealer),
  });
});

export const updateDealerProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { shopName, address, city, pincode, bankName, accountNo, ifsc } = req.body;

  const dealer = await Dealer.findOne({ user: req.user!._id });

  if (!dealer) {
    throw new ApiError(404, 'Dealer profile not found');
  }

  Object.assign(dealer, { shopName, address, city, pincode, bankName, accountNo, ifsc });
  await dealer.save();

  res.status(200).json({
    success: true,
    message: 'Dealer profile updated successfully',
    dealer: sanitizeDealerForSeller(dealer),
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

  const sellerUser = await User.findById(dealer.user);
  if (sellerUser) {
    sellerUser.isVerified = status === 'approved';
    await sellerUser.save();
  }

  if (status === 'approved') {
    await Vehicle.updateMany({ seller: dealer.user }, { isActive: true });
  } else if (status === 'rejected') {
    await Vehicle.updateMany({ seller: dealer.user }, { isActive: false });
  }

  res.status(200).json({
    success: true,
    message: `Dealer ${status} successfully`,
    dealer,
  });
});
