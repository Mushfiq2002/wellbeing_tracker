const express = require('express');
const router = express.Router();
const { addSleepLog, getSleepLogs } = require('../controllers/sleepController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getSleepLogs).post(protect, addSleepLog);

module.exports = router;
