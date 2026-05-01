const Streak = require('../models/Streak');

// @desc    Get all streaks for logged in user
// @route   GET /api/streaks
// @access  Private
const getStreaks = async (req, res) => {
  const streaks = await Streak.find({ user: req.user.id });
  res.status(200).json(streaks);
};

// @desc    Log activity and update streak
// @route   POST /api/streaks
// @access  Private
const logActivity = async (req, res) => {
  const { activityType } = req.body;

  if (!activityType) {
    res.status(400);
    throw new Error('Please add an activity type');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if streak already exists for this activity
  let streak = await Streak.findOne({ user: req.user.id, activityType });

  if (!streak) {
    // First time logging this activity
    streak = await Streak.create({
      user: req.user.id,
      activityType,
      currentStreak: 1,
      lastLoggedDate: today,
    });
  } else {
    const lastLogged = new Date(streak.lastLoggedDate);
    lastLogged.setHours(0, 0, 0, 0);

    if (lastLogged.getTime() === today.getTime()) {
      // Already logged today
      res.status(400);
      throw new Error('Activity already logged today');
    } else if (lastLogged.getTime() === yesterday.getTime()) {
      // Logged yesterday - continue streak
      streak.currentStreak += 1;
      streak.lastLoggedDate = today;
    } else {
      // Streak broken - reset
      streak.currentStreak = 1;
      streak.lastLoggedDate = today;
    }

    await streak.save();
  }

  res.status(200).json(streak);
};

module.exports = {
  getStreaks,
  logActivity,
};
