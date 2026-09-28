import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { getAdminOverview, getPendingUsers, verifyUser } from '../controllers/admin.controller.js';

const router = Router();
router.get('/overview', authenticate, authorize('admin'), getAdminOverview);
router.get('/users/pending', authenticate, authorize('admin'), getPendingUsers);
router.put('/users/:id/verify', authenticate, authorize('admin'), verifyUser);

export default router;
