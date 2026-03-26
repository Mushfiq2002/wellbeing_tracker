const Appointment = require('../models/appointmentModel');

// @desc    Create appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
  try {
    const { therapist, appointmentDate, timeSlot, modeOfSession, notes } = req.body;

    if (!therapist || !appointmentDate || !timeSlot) {
      return res.status(400).json({
        message: 'Please provide therapist, appointment date, and time slot',
      });
    }

    const appointment = await Appointment.create({
      user: req.user._id,
      therapist,
      appointmentDate,
      timeSlot,
      modeOfSession,
      notes,
      status: 'pending',
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('therapist', 'name specialization location consultationFee availability modeOfSession')
      .populate('user', 'name email');

    res.status(201).json(populatedAppointment);
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Failed to create appointment',
    });
  }
};

// @desc    Get logged in user's appointments
// @route   GET /api/appointments/my
// @access  Private
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate('therapist', 'name specialization location consultationFee availability modeOfSession')
      .sort({ createdAt: -1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Failed to get appointments',
    });
  }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to cancel this appointment' });
    }

    appointment.status = 'cancelled';

    const updatedAppointment = await appointment.save();

    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Failed to cancel appointment',
    });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
};