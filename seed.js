// seed.js
// Yeh script poora shuruaati data (admin samait) database mein daalne ke liye hai.

const mongoose = require('mongoose');
require('dotenv').config();

// --- Models Import ---
const User = require('./models/User'); // Admin User ka model
const Student = require('./models/Student');
const Teacher = require('./models/Teacher');
const Assignment = require('./models/Assignment');
const SubjectNotes = require('./models/Note');
const Quiz = require('./models/Quiz');
const Download = require('./models/Download');
const Gallery = require('./models/Gallery');

// --- Static Data Import ---
const studentsData = require('./data/students.js');
const teachersData = require('./data/teachers.js');
const assignmentsData = require('./data/assignments.js');
const notesData = require('./data/notes.js');
const quizData = require('./data/quiz.js');
const downloadsData = require('./data/downloads.js');
const galleryData = require('./data/gallery.js');

// Helper functions (inhein tabdeel karne ki zaroorat nahi)
const formatNotesData = (notes) => Object.keys(notes).map(key => ({ slug: key, subject: notes[key].subject, notes: notes[key].notes }));
const formatQuizData = (quizzes) => Object.keys(quizzes).map(lang => ({ language: lang, questions: quizzes[lang] }));

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Database se connection kamyab ho gaya (seeding ke liye)...');

        // 1. Pehle Admin User Banayein
        console.log('Admin user check kiya ja raha hai...');
        // Purane users ko delete karein taake har baar naya na bane
        await User.deleteMany({}); 
        
        // Naya admin user banayein
        const adminUser = new User({
            username: 'admin',
            password: 'password123' // Yeh password khud-ba-khud hash ho jayega
        });
        await adminUser.save();
        console.log('Admin user kamyabi se ban gaya hai (username: admin, password: password123)');


        // 2. Baqi tamam data seed karein
        console.log('Baqi data delete aur seed kiya ja raha hai...');
        await Student.deleteMany({});
        await Teacher.deleteMany({});
        await Assignment.deleteMany({});
        await SubjectNotes.deleteMany({});
        await Quiz.deleteMany({});
        await Download.deleteMany({});
        await Gallery.deleteMany({});
        
        await Student.insertMany(studentsData);
        await Teacher.insertMany(teachersData);
        await Assignment.insertMany(assignmentsData);
        await SubjectNotes.insertMany(formatNotesData(notesData));
        await Quiz.insertMany(formatQuizData(quizData));
        await Download.insertMany(downloadsData);
        await Gallery.insertMany(galleryData);
        console.log('Tamam naya data kamyabi se daal diya gaya hai!');

    } catch (error) {
        console.error('Seeding mein masla hai:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection band kar diya gaya hai.');
    }
};

seedDatabase();
