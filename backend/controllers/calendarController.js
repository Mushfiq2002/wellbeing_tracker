const Calendar = require('../models/Calendar');

// @desc    Get all calendar events for logged in user
// @route   GET /api/calendar
// @access  Private
const getEvents = async (req, res) => {
  const events = await Calendar.find({ user: req.user.id });
  res.status(200).json(events);
};

// @desc    Create a calendar event
// @route   POST /api/calendar
// @access  Private
const createEvent = async (req, res) => {
  if (!req.body.date || !req.body.type || !req.body.description) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const event = await Calendar.create({
    user: req.user.id,
    date: req.body.date,
    type: req.body.type,
    description: req.body.description,
  });

  res.status(201).json(event);
};

// @desc    Delete a calendar event
// @route   DELETE /api/calendar/:id
// @access  Private
const deleteEvent = async (req, res) => {
  const event = await Calendar.findById(req.params.id);

  if (!event) {
    res.status(400);
    throw new Error('Event not found');
  }

  if (event.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await event.deleteOne();

  res.status(200).json({ id: req.params.id });
};

module.exports = {
  getEvents,
  createEvent,
  deleteEvent,
};
