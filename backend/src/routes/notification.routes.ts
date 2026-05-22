import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../controllers/notification.controller.js';

const router = Router();

router.use(authenticate);
router.get('/', getNotifications);
router.put('/:id/read', markNotificationRead);
router.put('/read-all', markAllNotificationsRead);

export default router;
