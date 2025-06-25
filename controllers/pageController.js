// controllers/pageController.js (Updated to handle language)

// --- Model Imports ---
const Student = require('../models/Student.js');
const Teacher = require('../models/Teacher.js');
const Assignment = require('../models/Assignment.js');
const SubjectNotes = require('../models/Note.js');
const Quiz = require('../models/Quiz.js');
const Download = require('../models/Download.js');
const Gallery = require('../models/Gallery.js');

// --- Helper Function ---
const getLanguage = (req) => req.query.lang === 'ur' ? 'ur' : 'en';

// --- Page Rendering Logic ---

const renderDirectory = async (req, res) => {
    try {
        const lang = getLanguage(req);
        const searchTerm = req.query.search || '';
        const filter = {};
        if (searchTerm) {
            filter.name = { $regex: searchTerm, $options: 'i' };
        }
        const allStudents = await Student.find(filter);
        res.render('directory', { 
            students: allStudents, 
            pageTitle: 'Student Directory',
            searchTerm: searchTerm,
            lang: lang // Language ko view mein bhejein
        });
    } catch (error) {
        console.log("Directory page render karne mein masla hai: ", error);
        res.status(500).send("Oops! Something went wrong.");
    }
};

const renderTeachers = async (req, res) => {
    try {
        const lang = getLanguage(req);
        const allTeachers = await Teacher.find({});
        res.render('teachers', {
            teachers: allTeachers,
            pageTitle: 'Faculty Information',
            lang: lang
        });
    } catch (error) {
        console.error("Teachers page render karne mein masla hai: ", error);
        res.status(500).send("Oops! Something went wrong.");
    }
};

// Baqi tamam public pages mein bhi 'lang' bhejein
const renderDashboard = (req, res) => res.render('dashboard', { pageTitle: 'Dashboard', lang: getLanguage(req) });
const renderTimetable = (req, res) => { const timetableData = require('../data/timetable.js'); res.render('timetable', { data: timetableData, pageTitle: 'Class Timetable', lang: getLanguage(req) }); };
const renderAssignments = async (req, res) => { try { const assignments = await Assignment.find({}); res.render('assignments', { assignments, pageTitle: 'Assignments', lang: getLanguage(req) }); } catch (e) { res.status(500).send("Error"); } };
const renderNotes = async (req, res) => { try { const notesArray = await SubjectNotes.find({}); const notesObject = notesArray.reduce((obj, item) => { obj[item.slug] = item; return obj; }, {}); res.render('notes', { subjects: notesObject, pageTitle: 'Subject Notes', lang: getLanguage(req) }); } catch (e) { res.status(500).send("Error"); } };
const renderQuiz = async (req, res) => { try { const quizArray = await Quiz.find({}); const quizObject = quizArray.reduce((obj, item) => { obj[item.language] = { questions: item.questions }; return obj; }, {}); res.render('quiz', { quiz: quizObject, pageTitle: 'Quiz Zone', lang: getLanguage(req) }); } catch (e) { res.status(500).send("Error"); } };
const renderDownloads = async (req, res) => { try { const files = await Download.find({}); res.render('downloads', { files, pageTitle: 'Download Center', lang: getLanguage(req) }); } catch (e) { res.status(500).send("Error"); } };
const renderGallery = async (req, res) => { try { const images = await Gallery.find({}); res.render('gallery', { images, pageTitle: 'Photo Gallery', lang: getLanguage(req) }); } catch (e) { res.status(500).send("Error"); } };
const renderCalculator = (req, res) => res.render('calculator', { pageTitle: 'GPA Calculator', lang: getLanguage(req) });
const renderBirthdays = async (req, res) => { try { const students = await Student.find({}); res.render('birthdays', { students, pageTitle: 'Upcoming Birthdays', lang: getLanguage(req) }); } catch (e) { res.status(500).send("Error"); } };
const renderFeedback = (req, res) => res.render('feedback', { pageTitle: 'Feedback & Suggestions', lang: getLanguage(req) });

// --- Exports ---
module.exports = {
    renderDashboard, renderDirectory, renderTeachers, renderTimetable, renderAssignments,
    renderNotes, renderQuiz, renderDownloads, renderGallery, renderCalculator,
    renderBirthdays, renderFeedback
};
