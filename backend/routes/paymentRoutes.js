const express = require('express');
const router = express.Router();

const {
  getPaymentDetails,
  confirmPayment,
} = require('../controllers/paymentController');

const { protect } = require('../middleware/authMiddleware');

router.get('/:id', protect, getPaymentDetails);
router.put('/:id/confirm', protect, confirmPayment);

module.exports = router;