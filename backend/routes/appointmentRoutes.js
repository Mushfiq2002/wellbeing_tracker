const express = require('express');
const router = express.Router();

const {
  createAppointment,
  getMyAppointments,
  getTodayTherapistAppointments,
  getSessionAccess,
  startSession,
  markSessionStatus,
  cancelAppointment,
} = require('../controllers/appointmentController');

const { protect } = require('../middleware/authMiddleware');

// Create appointment
router.post('/', protect, createAppointment);

// Get user's appointments
router.get('/my', protect, getMyAppointments);

// Therapist dashboard: next 7 days appointments
router.get('/therapist/today', protect, getTodayTherapistAppointments);

// Session access
router.get('/session/:roomId', protect, getSessionAccess);

// Therapist starts online session
router.put('/start/:id', protect, startSession);

// Therapist marks session as done/missed
router.put('/:id/mark', protect, markSessionStatus);

// User cancels appointment
router.put('/:id/cancel', protect, cancelAppointment);

module.exports = router;