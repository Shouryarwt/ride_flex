import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { createReview, getVehicleReviews } from '../controllers/review.controller.js';

const router = Router();

router.get('/vehicle/:vehicleId', getVehicleReviews);
router.post('/', authenticate, authorize('user'), createReview);

export default router;
