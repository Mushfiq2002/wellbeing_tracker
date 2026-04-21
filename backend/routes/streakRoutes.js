const express = require('express');
const router = express.Router();
const { getStreaks, logActivity } = require('../controllers/streakController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getStreaks).post(protect, logActivity);

module.exports = router;
