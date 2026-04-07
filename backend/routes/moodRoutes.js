const express = require('express');
const router = express.Router();
const { logMood, getMoodHistory } = require('../controllers/moodController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, logMood).get(protect, getMoodHistory);

module.exports = router;
