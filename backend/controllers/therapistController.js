const Therapist = require('../models/therapistModel');
const Appointment = require('../models/appointmentModel');
const User = require('../models/userModel');

// GET ALL ACTIVE THERAPISTS - user side
const getTherapists = async (req, res) => {
  try {
const therapists = await Therapist.find({
  isActive: true,
}).sort({ createdAt: -1 });
    res.status(200).json(therapists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE THERAPIST
const createTherapist = async (req, res) => {
  try {
    const {
      name,
      email,
      specialization,
      location,
      consultationFee,
      availability,
      modeOfSession,
    } = req.body;

    if (
      !name ||
      !email ||
      !specialization ||
      !location ||
      !consultationFee ||
      !availability
    ) {
      return res.status(400).json({
        message: 'Please fill all required fields',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedName = name.trim();

    const therapistExists = await Therapist.findOne({
      $or: [{ name: normalizedName }, { email: normalizedEmail }],
    });

    if (therapistExists) {
      return res.status(400).json({
        message: 'Therapist with this name or email already exists',
      });
    }

    const therapist = await Therapist.create({
      name: normalizedName,
      email: normalizedEmail,
      specialization,
      location,
      consultationFee,
      availability,
      modeOfSession: modeOfSession || 'both',

      rating: 5,
      totalReviews: 0,
      reviews: [],

      isActive: true,
      ratingWarning: '',
      isRemovedDueToLowRating: false,
    });

    res.status(201).json(therapist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SUBMIT REVIEW

  // SUBMIT REVIEW
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
        message: 'Appointment ID is required',
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
        message: 'Review allowed only after session completion',
      });
    }

    if (appointment.isReviewed) {
      return res.status(400).json({
        message: 'Already reviewed',
      });
    }

    const review = {
      user: req.user._id,
      userName: req.user.name,
      appointment: appointment._id,
      rating: Number(rating),
      comment: comment || '',
    };

    therapist.reviews.push(review);
    therapist.totalReviews = therapist.reviews.length;

    const totalRating = therapist.reviews.reduce(
      (sum, item) => sum + Number(item.rating),
      0
    );

    const averageRating = totalRating / therapist.totalReviews;

    therapist.rating = Number(averageRating.toFixed(1));

    // Fair rating logic
    // New therapist ke 1/2 ta bad review diye instantly remove korbe na
    const minReviewsForAction = 3;

    therapist.ratingWarning = '';
    therapist.isRemovedDueToLowRating = false;

    if (therapist.totalReviews < minReviewsForAction) {
      therapist.isActive = true;

      if (therapist.rating < 3) {
        therapist.ratingWarning =
          'Warning: Your rating is below 3. Improve your service quality.';
      }
    } else {
      if (therapist.rating < 2.5) {
        therapist.ratingWarning =
          'Strong warning: Your rating is very low. Improve your service quality.';
      } else if (therapist.rating < 3) {
        therapist.ratingWarning =
          'Warning: Your rating is below 3. Improve your service quality.';
      }

      if (therapist.rating < 3) {
        therapist.isActive = false;
        therapist.isRemovedDueToLowRating = true;
      } else {
        therapist.isActive = true;
        therapist.isRemovedDueToLowRating = false;
      }
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
      message: 'Review submitted. 5% discount unlocked!',
      rating: therapist.rating,
      totalReviews: therapist.totalReviews,
      isActive: therapist.isActive,
      isRemovedDueToLowRating: therapist.isRemovedDueToLowRating,
      ratingWarning: therapist.ratingWarning,
      discountAvailable: true,
      reviews: therapist.reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Failed to submit review',
    });
  }
};

// GET MY THERAPIST PROFILE
const getMyTherapistProfile = async (req, res) => {
  try {
    const therapist = await Therapist.findOne({ user: req.user._id });

    if (!therapist) {
      return res.status(404).json({
        message: 'Therapist profile not found',
      });
    }

    res.status(200).json(therapist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE THERAPIST
const deleteTherapist = async (req, res) => {
  try {
    const therapist = await Therapist.findById(req.params.id);

    if (!therapist) {
      return res.status(404).json({ message: 'Therapist not found' });
    }

    await therapist.deleteOne();

    res.status(200).json({
      message: 'Therapist deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTherapists,
  createTherapist,
  submitTherapistReview,
  getMyTherapistProfile,
  deleteTherapist,
};