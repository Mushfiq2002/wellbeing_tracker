const Mood = require('../models/moodModel');

// @desc    Log or update daily mood
// @route   POST /api/moods
// @access  Private
const logMood = async (req, res, next) => {
    try {
    const { level, date } = req.body;

    if (!level || level < 1 || level > 5) {
        res.status(400);
        throw new Error('Please provide a valid mood level between 1 and 5');
    }

    // Default to today if date is not provided
    const targetDate = date || new Date().toISOString().split('T')[0];

    // Find if a mood exists for this user and date
    let mood = await Mood.findOne({ user: req.user.id, date: targetDate });

    if (mood) {
        // Update existing mood for the day
        mood.level = level;
        await mood.save();
    } else {
        // Create new mood entry
        mood = await Mood.create({
            user: req.user.id,
            date: targetDate,
            level,
        });
    }

        res.status(200).json(mood);
    } catch (error) {
        next(error);
    }
};

// @desc    Get mood history
// @route   GET /api/moods
// @access  Private
const getMoodHistory = async (req, res, next) => {
    try {
        // Get moods for the logged in user, sorted by date (ascending)
        const moods = await Mood.find({ user: req.user.id }).sort({ date: 1 });

        res.status(200).json(moods);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    logMood,
    getMoodHistory,
};
