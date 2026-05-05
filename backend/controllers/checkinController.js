const Checkin = require('../models/Checkin');

// @desc    Get all checkins for logged in user
// @route   GET /api/checkin
// @access  Private
const getCheckins = async (req, res) => {
  const checkins = await Checkin.find({ user: req.user.id }).sort({ date: -1 });
  res.status(200).json(checkins);
};

// @desc    Create a checkin
// @route   POST /api/checkin
// @access  Private
const createCheckin = async (req, res) => {
  const { date, question, answer } = req.body;

  if (!date || !question || !answer) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // Check if already checked in today
  const existing = await Checkin.findOne({ user: req.user.id, date });
  if (existing) {
    res.status(400);
    throw new Error('Already checked in today');
  }

  const checkin = await Checkin.create({
    user: req.user.id,
    date,
    question,
    answer,
  });

  res.status(201).json(checkin);
};

module.exports = { getCheckins, createCheckin };
