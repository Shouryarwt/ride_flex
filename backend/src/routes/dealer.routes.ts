import { Router } from 'express';
import {
  getDealerProfile,
  updateDealerProfile,
  getAllDealers,
  approveDealerStatus,
} from '../controllers/dealer.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/profile', authenticate, authorize('seller'), getDealerProfile);
router.get('/overview', authenticate, authorize('seller'), getDealerOverview);
router.put('/profile', authenticate, authorize('seller'), updateDealerProfile);
router.get('/', authenticate, authorize('admin'), getAllDealers);
router.put('/:id/approve', authenticate, authorize('admin'), approveDealerStatus);
router.put('/:id/official-verification', authenticate, authorize('admin'), verifyDealerOfficially);

export default router;
