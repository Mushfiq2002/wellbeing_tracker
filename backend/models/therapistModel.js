const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const therapistSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    specialization: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    consultationFee: {
      type: Number,
      required: true,
    },
    availability: {
      type: String,
      required: true,
    },
    modeOfSession: {
      type: String,
      enum: ['online', 'offline', 'both'],
      default: 'both',
    },

    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],

    isActive: {
      type: Boolean,
      default: true,
    },

    ratingWarning: {
      type: String,
      default: '',
    },

    isRemovedDueToLowRating: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Therapist', therapistSchema);