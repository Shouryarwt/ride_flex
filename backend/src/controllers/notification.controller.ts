import { Response } from 'express';
import { Notification } from '../models/Notification.model.js';
import { AuthRequest } from '../types/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const notifications = await Notification.find({ recipient: req.user!._id })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    notifications,
  });
});

export const markNotificationRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification || notification.recipient.toString() !== req.user!._id.toString()) {
    return res.status(404).json({ success: false, message: 'Notification not found' });
  }

  notification.read = true;
  await notification.save();

  res.status(200).json({
    success: true,
    notification,
  });
});

export const markAllNotificationsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  await Notification.updateMany({ recipient: req.user!._id, read: false }, { read: true });
  res.status(200).json({
    success: true,
    message: 'All notifications marked as read',
  });
});
