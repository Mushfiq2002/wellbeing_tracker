const mongoose = require('mongoose');

const sleepLogSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        startTime: {
            type: Date,
            required: [true, 'Please add a start time'],
        },
        endTime: {
            type: Date,
            required: [true, 'Please add an end time'],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('SleepLog', sleepLogSchema);
