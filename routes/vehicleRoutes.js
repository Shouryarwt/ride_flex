const express = require('express');
const {
  addVehicle,
  updateVehicle,
  deleteVehicle,
  getVehicles,
  getVehicleById,
  getMyVehicles,
} = require('../controllers/vehicleController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', getVehicles);
router.get('/my/list', authMiddleware, roleMiddleware('seller', 'admin'), getMyVehicles);
router.get('/:id', getVehicleById);
router.post('/', authMiddleware, roleMiddleware('seller', 'admin'), addVehicle);
router.put('/:id', authMiddleware, roleMiddleware('seller', 'admin'), updateVehicle);
router.delete('/:id', authMiddleware, roleMiddleware('seller', 'admin'), deleteVehicle);

module.exports = router;
