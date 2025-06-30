// controllers/pageController.js

const asyncHandler = require('../utils/asyncHandler');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Assignment = require('../models/Assignment');
const SubjectNotes = require('../models/Note');
const Download = require('../models/Download');
const Gallery = require('../models/Gallery');
const Quiz = require('../models/Quiz');

// Helper function to get language from request
const getLanguage = (req) => req.query.lang === 'ur' ? 'ur' : 'en';

const renderDashboard = (req, res) => {
    // This is the main public-facing homepage.
    res.render('dashboard', { title: 'Dashboard', lang: getLanguage(req) });
};

const renderDirectory = asyncHandler(async (req, res) => {
    const students = await Student.find({}).sort({ name: 1 }); // Sort alphabetically
    res.render('directory', {
        title: 'Student Directory',
        students,
        lang: getLanguage(req)
    });
});

const renderTimetable = (req, res) => {
    res.send('Timetable Page - TODO');
};

const renderAssignments = asyncHandler(async (req, res) => {
    const assignments = await Assignment.find({}).sort({ deadline: 1 }); // Sort by nearest deadline
    res.render('assignments', {
        title: 'Current Assignments',
        assignments,
        lang: getLanguage(req)
    });
});

// This is the first dynamic public page we are building.
const renderTeachers = asyncHandler(async (req, res) => {
    const teachers = await Teacher.find({}).sort({ createdAt: 'asc' });
    res.render('teachers', { 
        title: 'Our Faculty', 
        teachers,
        lang: getLanguage(req) 
    });
});

const renderNotes = asyncHandler(async (req, res) => {
    const subjects = await SubjectNotes.find({}).sort({ 'subject.en': 1 });
    res.render('notes', {
        title: 'Course Notes',
        subjects,
        lang: getLanguage(req)
    });
});

const renderQuiz = asyncHandler(async (req, res) => {
    const lang = getLanguage(req);
    const quiz = await Quiz.findOne({ language: lang });

    res.render('quiz', {
        title: 'Test Your Knowledge',
        quiz,
        lang
    });
});

const renderDownloads = asyncHandler(async (req, res) => {
    const downloads = await Download.find({}).sort({ category: 1, createdAt: -1 });

    // Group downloads by category for better organization in the view
    const groupedDownloads = downloads.reduce((acc, download) => {
        const category = download.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(download);
        return acc;
    }, {});

    res.render('downloads', {
        title: 'Downloads',
        groupedDownloads,
        lang: getLanguage(req)
    });
});

const renderGallery = asyncHandler(async (req, res) => {
    const images = await Gallery.find({}).sort({ category: 1, createdAt: -1 });

    // Group images by category for better organization
    const groupedImages = images.reduce((acc, image) => {
        const category = image.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(image);
        return acc;
    }, {});

    res.render('gallery', {
        title: 'Image Gallery',
        groupedImages,
        lang: getLanguage(req)
    });
});

const renderCalculator = (req, res) => {
    res.send('Calculator Page - TODO');
};

const renderBirthdays = asyncHandler(async (req, res) => {
    const today = new Date();
    // Set time to 0 to avoid timezone issues
    today.setHours(0, 0, 0, 0); 

    // Efficiently find students with a birthday today using MongoDB's aggregation pipeline
    const studentsWithBirthday = await Student.aggregate([
        {
            $match: {
                birthday: { $exists: true }, // Ensure the birthday field exists
                $expr: {
                    $and: [
                        { $eq: [{ $dayOfMonth: '$birthday' }, today.getDate()] },
                        { $eq: [{ $month: '$birthday' }, today.getMonth() + 1] }
                    ]
                }
            }
        }
    ]);

    res.render('birthdays', { title: "Today's Birthdays", students: studentsWithBirthday, lang: getLanguage(req) });
});

const renderFeedback = (req, res) => {
    res.render('feedback', { title: 'Feedback', lang: getLanguage(req) });
};

module.exports = {
    renderDashboard, renderDirectory, renderTimetable, renderAssignments,
    renderTeachers, renderNotes, renderQuiz, renderDownloads, renderGallery,
    renderCalculator, renderBirthdays, renderFeedback
};