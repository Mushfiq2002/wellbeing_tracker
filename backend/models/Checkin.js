const mongoose = require('mongoose');

const checkinSchema = mongoose.Schema(
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
    question: {
      type: String,
      required: [true, 'Please add a question'],
    },
    answer: {
      type: String,
      enum: ['Yes', 'No'],
      required: [true, 'Please add an answer'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Checkin', checkinSchema);
