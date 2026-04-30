const mongoose = require('mongoose');

const studySessionSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        course: {
            type: String,
            required: [true, 'Please add a course name'],
        },
        durationMinutes: {
            type: Number,
            required: [true, 'Please add the duration in minutes'],
        },
        date: {
            type: Date,
            required: [true, 'Please add a date'],
            default: Date.now,
        },
        notes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('StudySession', studySessionSchema);
