import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { createComplianceNotifications } from '../services/complianceNotification.service.js';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../controllers/notification.controller.js';

const router = Router();

router.get('/jobs/compliance', async (req, res, next) => {
  try {
    const secret = process.env.CRON_SECRET;
    const authHeader = req.get('authorization') || '';
    if (!secret || authHeader !== `Bearer ${secret}`) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    await createComplianceNotifications();
    return res.json({ success: true, message: 'Compliance notifications processed' });
  } catch (error) {
    return next(error);
  }
});

router.use(authenticate);
router.get('/', getNotifications);
router.put('/:id/read', markNotificationRead);
router.put('/read-all', markAllNotificationsRead);

export default router;
