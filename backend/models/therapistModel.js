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

    // Rating & Review System
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],

    // Automated Therapist Removal System
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Therapist', therapistSchema);