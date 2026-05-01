const Therapist = require('../models/therapistModel');
const Appointment = require('../models/appointmentModel');
const User = require('../models/userModel');

const getTherapists = async (req, res) => {
  try {
    const therapists = await Therapist.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.status(200).json(therapists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTherapist = async (req, res) => {
  try {
    const {
      name,
      specialization,
      location,
      consultationFee,
      availability,
      modeOfSession,
    } = req.body;

    if (!name || !specialization || !location || !consultationFee || !availability) {
      return res.status(400).json({
        message: 'Please fill all required fields',
      });
    }

    const therapistExists = await Therapist.findOne({ name });

    if (therapistExists) {
      return res.status(400).json({
        message: 'Therapist already exists',
      });
    }

    const therapist = await Therapist.create({
      name,
      specialization,
      location,
      consultationFee,
      availability,
      modeOfSession: modeOfSession || 'both',
      rating: 0,
      totalReviews: 0,
      reviews: [],
      isActive: true,
    });

    res.status(201).json(therapist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const submitTherapistReview = async (req, res) => {
  try {
    const { rating, comment, appointmentId } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: 'Please provide a rating between 1 and 5',
      });
    }

    if (!appointmentId) {
      return res.status(400).json({
        message: 'Appointment ID is required for review',
      });
    }

    const therapist = await Therapist.findById(req.params.id);

    if (!therapist) {
      return res.status(404).json({ message: 'Therapist not found' });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'You can only review your own appointment',
      });
    }

    if (appointment.therapist.toString() !== therapist._id.toString()) {
      return res.status(400).json({
        message: 'This appointment does not belong to this therapist',
      });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        message: 'Cancelled appointment cannot be reviewed',
      });
    }

    if (appointment.status !== 'review_pending') {
      return res.status(400).json({
        message: 'You can review only after the session is done',
      });
    }

    if (appointment.isReviewed) {
      return res.status(400).json({
        message: 'You already reviewed this appointment',
      });
    }

    const review = {
      user: req.user._id,
      userName: req.user.name,
      rating: Number(rating),
      comment: comment || '',
    };

    therapist.reviews.push(review);
    therapist.totalReviews = therapist.reviews.length;

    const totalRating = therapist.reviews.reduce(
      (sum, item) => sum + item.rating,
      0
    );

    therapist.rating = Number((totalRating / therapist.totalReviews).toFixed(1));

    if (therapist.totalReviews >= 3 && therapist.rating < 3) {
      therapist.isActive = false;
    }

    appointment.isReviewed = true;
    appointment.reviewedAt = new Date();
    appointment.status = 'completed';

    const user = await User.findById(req.user._id);
    if (user) {
      user.discountAvailable = true;
      await user.save();
    }

    await therapist.save();
    await appointment.save();

    res.status(201).json({
      message: 'Review submitted successfully. 5% discount unlocked for your next appointment.',
      rating: therapist.rating,
      totalReviews: therapist.totalReviews,
      isActive: therapist.isActive,
      discountAvailable: true,
      reviews: therapist.reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Failed to submit review',
    });
  }
};

const deleteTherapist = async (req, res) => {
  try {
    const therapist = await Therapist.findById(req.params.id);

    if (!therapist) {
      return res.status(404).json({ message: 'Therapist not found' });
    }

    await therapist.deleteOne();

    res.status(200).json({ message: 'Therapist deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTherapists,
  createTherapist,
  submitTherapistReview,
  deleteTherapist,
};