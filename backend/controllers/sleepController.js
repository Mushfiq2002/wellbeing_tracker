const SleepLog = require('../models/sleepLogModel');

// @desc    Add a new sleep log
// @route   POST /api/sleep
// @access  Private
const addSleepLog = async (req, res, next) => {
    try {
        const { startTime, endTime } = req.body;

        if (!startTime || !endTime) {
            res.status(400);
            throw new Error('Please add both start time and end time');
        }

        if (new Date(endTime) <= new Date(startTime)) {
            res.status(400);
            throw new Error('End time must be after start time');
        }

        const sleepLog = await SleepLog.create({
            user: req.user._id,
            startTime,
            endTime,
        });

        res.status(201).json(sleepLog);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all sleep logs for logged-in user
// @route   GET /api/sleep
// @access  Private
const getSleepLogs = async (req, res, next) => {
    try {
        const sleepLogs = await SleepLog.find({ user: req.user._id }).sort({
            createdAt: -1,
        });

        res.status(200).json(sleepLogs);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addSleepLog,
    getSleepLogs,
};
