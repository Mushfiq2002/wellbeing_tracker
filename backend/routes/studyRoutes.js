const express = require('express');
const router = express.Router();
const {
    getStudySessions,
    createStudySession,
    deleteStudySession,
    getAcademicResults,
    createAcademicResult,
    deleteAcademicResult,
} = require('../controllers/studyController');
const { protect } = require('../middleware/authMiddleware');

router.route('/sessions').get(protect, getStudySessions).post(protect, createStudySession);
router.route('/sessions/:id').delete(protect, deleteStudySession);

router.route('/results').get(protect, getAcademicResults).post(protect, createAcademicResult);
router.route('/results/:id').delete(protect, deleteAcademicResult);

module.exports = router;
