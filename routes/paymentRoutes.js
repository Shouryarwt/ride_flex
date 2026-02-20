const express = require('express');
const {
  createPaymentOrder,
  markPaymentStatus,
  getMyPayments,
} = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/order', authMiddleware, roleMiddleware('user', 'seller', 'admin'), createPaymentOrder);
router.patch('/:paymentId/status', authMiddleware, roleMiddleware('user', 'seller', 'admin'), markPaymentStatus);
router.get('/me', authMiddleware, roleMiddleware('user', 'seller', 'admin'), getMyPayments);

module.exports = router;
