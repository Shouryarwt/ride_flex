import { Router } from 'express';
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  getMyVehicles,
  updateVehicle,
  deleteVehicle,
} from '../controllers/vehicle.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getVehicles);
router.get('/my-vehicles', authenticate, authorize('seller'), getMyVehicles);
router.get('/:id', getVehicleById);
router.post('/', authenticate, authorize('seller'), createVehicle);
router.put('/:id', authenticate, authorize('seller'), updateVehicle);
router.delete('/:id', authenticate, authorize('seller'), deleteVehicle);

export default router;
