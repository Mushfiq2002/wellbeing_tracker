const express = require('express');
const router = express.Router();

const {
  getTherapists,
  createTherapist,
  submitTherapistReview,
  deleteTherapist,
} = require('../controllers/therapistController');

const { protect } = require('../middleware/authMiddleware');

// Get + Create
router.route('/').get(getTherapists).post(createTherapist);

// 🔥 NEW: Submit review (LOGIN REQUIRED)
router.post('/:id/reviews', protect, submitTherapistReview);

// Delete
router.route('/:id').delete(deleteTherapist);

module.exports = router;