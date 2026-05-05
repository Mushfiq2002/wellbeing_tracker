const mongoose = require('mongoose');

const reminderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    category: {
      type: String,
      enum: ['study', 'sleep', 'medicine', 'other'],
      required: [true, 'Please add a category'],
    },
    time: {
      type: String,
      required: [true, 'Please add a time'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reminder', reminderSchema);
