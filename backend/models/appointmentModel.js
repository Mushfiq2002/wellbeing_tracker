const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    therapist: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Therapist',
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    timeSlot: {
      type: String,
      required: true,
    },

    modeOfSession: {
      type: String,
      enum: ['online', 'offline'],
      default: 'online',
    },

    notes: {
      type: String,
      default: '',
    },

    status: {
      type: String,
      enum: [
        'pending',
        'missed',
        'review_pending',
        'completed',
        'cancelled',
      ],
      default: 'pending',
    },

    sessionRoomId: {
      type: String,
      default: '',
    },

    meetingLink: {
      type: String,
      default: '',
    },

    sessionStarted: {
      type: Boolean,
      default: false,
    },

    sessionStartedAt: {
      type: Date,
      default: null,
    },

    sessionEndedAt: {
      type: Date,
      default: null,
    },

    userJoined: {
      type: Boolean,
      default: false,
    },

    userJoinedAt: {
      type: Date,
      default: null,
    },

    therapistMarked: {
      type: Boolean,
      default: false,
    },

    therapistMarkedStatus: {
      type: String,
      enum: ['done', 'missed', ''],
      default: '',
    },

    therapistMarkedAt: {
      type: Date,
      default: null,
    },

    isReviewed: {
      type: Boolean,
      default: false,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    // PAYMENT DATA
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    },

    originalFee: {
      type: Number,
      default: 0,
    },

    discountApplied: {
      type: Boolean,
      default: false,
    },

    discountAmount: {
      type: Number,
      default: 0,
    },

    finalFee: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);