const mongoose = require('mongoose');

const moodSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        date: {
            type: String, // Stored as YYYY-MM-DD
            required: true,
        },
        level: {
            type: Number,
            required: true,
            min: 1, // 1: Very Bad
            max: 5, // 5: Very Good
        },
    },
    {
        timestamps: true,
    }
);

// Ensure a user can only have one mood entry per day
moodSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Mood', moodSchema);
