const express = require('express');
const router = express.Router();
const { getEvents, createEvent, deleteEvent } = require('../controllers/calendarController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getEvents).post(protect, createEvent);
router.route('/:id').delete(protect, deleteEvent);

module.exports = router;
