import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { addFavorite, getMyFavorites, removeFavorite } from '../controllers/favorite.controller.js';

const router = Router();

router.get('/my', authenticate, authorize('user'), getMyFavorites);
router.post('/', authenticate, authorize('user'), addFavorite);
router.delete('/:vehicleId', authenticate, authorize('user'), removeFavorite);

export default router;

