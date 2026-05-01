const mongoose = require('mongoose');

const streakSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    activityType: {
      type: String,
      enum: ['mood', 'sleep', 'study'],
      required: [true, 'Please add an activity type'],
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    lastLoggedDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Streak', streakSchema);
