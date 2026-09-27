import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { createComplianceNotifications } from '../services/complianceNotification.service.js';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../controllers/notification.controller.js';

const router = Router();

router.use(authenticate);
router.get('/', getNotifications);
router.put('/:id/read', markNotificationRead);
router.put('/read-all', markAllNotificationsRead);

router.post('/jobs/compliance', authorize('admin'), async (_req, res, next) => {
  try { await createComplianceNotifications(); res.json({ success: true, message: 'Compliance notifications processed' }); }
  catch (error) { next(error); }
});

export default router;
