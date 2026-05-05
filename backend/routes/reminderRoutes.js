const express = require('express');
const router = express.Router();
const { getReminders, createReminder, deleteReminder } = require('../controllers/reminderController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getReminders).post(protect, createReminder);
router.route('/:id').delete(protect, deleteReminder);

module.exports = router;
