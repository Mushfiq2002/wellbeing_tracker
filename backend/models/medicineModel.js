const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    medicineName: {
      type: String,
      required: [true, 'Please add a medicine name'],
    },
    times: {
      type: [String],
      required: [true, 'Please add at least one reminder time'],
    },
  },
  {
    timestamps: true,
  }
);

const Medicine = mongoose.model('Medicine', medicineSchema);

module.exports = Medicine;
