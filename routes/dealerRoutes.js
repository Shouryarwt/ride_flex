const express = require('express');
const {
  registerDealer,
  getMyDealerProfile,
  getAllDealers,
  updateDealerStatus,
} = require('../controllers/dealerController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/register', authMiddleware, roleMiddleware('user', 'seller'), registerDealer);
router.get('/me', authMiddleware, roleMiddleware('seller', 'admin'), getMyDealerProfile);
router.get('/', authMiddleware, roleMiddleware('admin'), getAllDealers);
router.patch('/:id/status', authMiddleware, roleMiddleware('admin'), updateDealerStatus);

module.exports = router;
