const mongoose = require('mongoose');

const academicResultSchema = mongoose.Schema(
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
        type: {
            type: String,
            enum: ['Quiz', 'Midterm', 'Final', 'Assignment', 'Other'],
            required: [true, 'Please add an exam type'],
        },
        score: {
            type: Number,
            required: [true, 'Please add a score'],
        },
        totalScore: {
            type: Number,
            required: [true, 'Please add a total possible score'],
        },
        date: {
            type: Date,
            required: [true, 'Please add a date'],
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('AcademicResult', academicResultSchema);
