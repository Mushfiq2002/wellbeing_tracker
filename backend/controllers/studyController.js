const asyncHandler = require('express-async-handler');
const StudySession = require('../models/studySessionModel');
const AcademicResult = require('../models/academicResultModel');

// @desc    Get study sessions
// @route   GET /api/study/sessions
// @access  Private
const getStudySessions = asyncHandler(async (req, res) => {
    const sessions = await StudySession.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(sessions);
});

// @desc    Create study session
// @route   POST /api/study/sessions
// @access  Private
const createStudySession = asyncHandler(async (req, res) => {
    const { course, durationMinutes, date, notes } = req.body;

    if (!course || !durationMinutes) {
        res.status(400);
        throw new Error('Please add all required fields');
    }

    const session = await StudySession.create({
        user: req.user.id,
        course,
        durationMinutes,
        date: date || Date.now(),
        notes,
    });

    res.status(201).json(session);
});

// @desc    Delete study session
// @route   DELETE /api/study/sessions/:id
// @access  Private
const deleteStudySession = asyncHandler(async (req, res) => {
    const session = await StudySession.findById(req.params.id);

    if (!session) {
        res.status(404);
        throw new Error('Study session not found');
    }

    if (session.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await session.deleteOne();
    res.status(200).json({ id: req.params.id });
});

// @desc    Get academic results
// @route   GET /api/study/results
// @access  Private
const getAcademicResults = asyncHandler(async (req, res) => {
    const results = await AcademicResult.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(results);
});

// @desc    Create academic result
// @route   POST /api/study/results
// @access  Private
const createAcademicResult = asyncHandler(async (req, res) => {
    const { course, type, score, totalScore, date } = req.body;

    if (!course || !type || score === undefined || totalScore === undefined) {
        res.status(400);
        throw new Error('Please add all required fields');
    }

    const result = await AcademicResult.create({
        user: req.user.id,
        course,
        type,
        score,
        totalScore,
        date: date || Date.now(),
    });

    res.status(201).json(result);
});

// @desc    Delete academic result
// @route   DELETE /api/study/results/:id
// @access  Private
const deleteAcademicResult = asyncHandler(async (req, res) => {
    const result = await AcademicResult.findById(req.params.id);

    if (!result) {
        res.status(404);
        throw new Error('Academic result not found');
    }

    if (result.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await result.deleteOne();
    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getStudySessions,
    createStudySession,
    deleteStudySession,
    getAcademicResults,
    createAcademicResult,
    deleteAcademicResult,
};
