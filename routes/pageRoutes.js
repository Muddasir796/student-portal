// routes/pageRoutes.js

const express = require('express');
const router = express.Router();

// Controller se tamam page render karne wale functions import karein
const { 
    renderDashboard,
    renderDirectory,
    renderTimetable,
    renderAssignments,
    renderTeachers,
    renderNotes,
    renderQuiz,
    renderDownloads,
    renderGallery,
    renderCalculator,
    renderBirthdays,
    renderFeedback
} = require('../controllers/pageController.js');

// --- Page Routes ---
router.get('/', renderDashboard);
router.get('/directory', renderDirectory);
router.get('/timetable', renderTimetable);
router.get('/assignments', renderAssignments);
router.get('/teachers', renderTeachers);
router.get('/notes', renderNotes);
router.get('/quiz', renderQuiz);
router.get('/downloads', renderDownloads);
router.get('/gallery', renderGallery);
router.get('/calculator', renderCalculator);
router.get('/birthdays', renderBirthdays);
router.get('/feedback', renderFeedback);


// Is router ko export karein
module.exports = router;
