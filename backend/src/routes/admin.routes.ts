import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { getAdminOverview } from '../controllers/admin.controller.js';

const router = Router();
router.get('/overview', authenticate, authorize('admin'), getAdminOverview);

export default router;
