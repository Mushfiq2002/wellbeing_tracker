const mongoose = require('mongoose');

const calendarSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    date: {
      type: String,
      required: [true, 'Please add a date'],
    },
    type: {
      type: String,
      enum: ['todo', 'mood', 'sleep', 'note'],
      required: [true, 'Please add an event type'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Calendar', calendarSchema);
