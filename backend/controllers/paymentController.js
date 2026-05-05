const Appointment = require('../models/appointmentModel');
const User = require('../models/userModel');

const getPaymentDetails = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('therapist');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const user = await User.findById(req.user._id);

    const originalFee = appointment.therapist.consultationFee;
    const discountApplied = user.discountAvailable === true;
    const discountAmount = discountApplied ? originalFee * 0.05 : 0;
    const finalFee = originalFee - discountAmount;

    res.json({
      appointmentId: appointment._id,
      therapistName: appointment.therapist.name,
      originalFee,
      discountApplied,
      discountAmount,
      finalFee,
      paymentStatus: appointment.paymentStatus,
    });
  } catch (error) {
    res.status(500).json({ message: 'Payment details failed' });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('therapist');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (appointment.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Already paid' });
    }

    const user = await User.findById(req.user._id);

    const originalFee = appointment.therapist.consultationFee;
    const discountApplied = user.discountAvailable === true;
    const discountAmount = discountApplied ? originalFee * 0.05 : 0;
    const finalFee = originalFee - discountAmount;

    appointment.originalFee = originalFee;
    appointment.discountApplied = discountApplied;
    appointment.discountAmount = discountAmount;
    appointment.finalFee = finalFee;
    appointment.paymentStatus = 'paid';

    await appointment.save();

    if (discountApplied) {
      user.discountAvailable = false;
      await user.save();
    }

    res.json({
      message: 'Payment successful',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: 'Payment failed' });
  }
};

module.exports = {
  getPaymentDetails,
  confirmPayment,
};