const mongoose = require('mongoose');

const reminderLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Medicine',
    },
    time: {
      type: String,
      required: [true, 'Please provide the reminder time'],
    },
    date: {
      type: String,
      required: [true, 'Please provide the date (YYYY-MM-DD)'],
    },
    taken: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ReminderLog = mongoose.model('ReminderLog', reminderLogSchema);

module.exports = ReminderLog;
