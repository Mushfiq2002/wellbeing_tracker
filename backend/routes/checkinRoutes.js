const express = require('express');
const router = express.Router();
const { getCheckins, createCheckin } = require('../controllers/checkinController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getCheckins).post(protect, createCheckin);

module.exports = router;
