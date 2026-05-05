const Reminder = require('../models/Reminder');

// @desc    Get all reminders for logged in user
// @route   GET /api/reminders
// @access  Private
const getReminders = async (req, res) => {
  const reminders = await Reminder.find({ user: req.user.id });
  res.status(200).json(reminders);
};

// @desc    Create a reminder
// @route   POST /api/reminders
// @access  Private
const createReminder = async (req, res) => {
  const { title, category, time } = req.body;

  if (!title || !category || !time) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const reminder = await Reminder.create({
    user: req.user.id,
    title,
    category,
    time,
  });

  res.status(201).json(reminder);
};

// @desc    Delete a reminder
// @route   DELETE /api/reminders/:id
// @access  Private
const deleteReminder = async (req, res) => {
  const reminder = await Reminder.findById(req.params.id);

  if (!reminder) {
    res.status(400);
    throw new Error('Reminder not found');
  }

  if (reminder.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await reminder.deleteOne();
  res.status(200).json({ id: req.params.id });
};

module.exports = { getReminders, createReminder, deleteReminder };
