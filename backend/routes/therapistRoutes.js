const express = require('express');
const router = express.Router();

const {
  getTherapists,
  createTherapist,
  submitTherapistReview,
  deleteTherapist,
  getMyTherapistProfile,
} = require('../controllers/therapistController');

const { protect } = require('../middleware/authMiddleware');

// 🔥 Get all therapists (user side)
router.get('/', getTherapists);

// 🔥 Create therapist
router.post('/', createTherapist);

// 🔥 Submit review (login required)
router.post('/:id/reviews', protect, submitTherapistReview);

// 🔥 Delete therapist
router.delete('/:id', deleteTherapist);
router.get('/me/profile', protect, getMyTherapistProfile);

module.exports = router;