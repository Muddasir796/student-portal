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
    // Safety check: Yeh script sirf development environment mein chalni chahiye.
    if (process.env.NODE_ENV === 'production') {
        console.error('ATTENTION: Seed script production environment mein nahi chal sakti. Operation radd kar diya gaya.');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Database se connection kamyab ho gaya (seeding ke liye)...');

        // --- Data Cleanup ---
        // Tamam purana data ek saath parallel mein delete karein.
        console.log('Purana data delete kiya ja raha hai...');
        await Promise.all([
            User.deleteMany({}),
            Student.deleteMany({}),
            Teacher.deleteMany({}),
            Assignment.deleteMany({}),
            SubjectNotes.deleteMany({}),
            Quiz.deleteMany({}),
            Download.deleteMany({}),
            Gallery.deleteMany({}),
        ]);
        console.log('Purana data kamyabi se delete ho gaya.');

        // --- Admin User Creation ---
        // Admin credentials .env file se lein taake woh secure rahein.
        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        const adminPassword = process.env.ADMIN_PASSWORD || 'password123';

        console.log('Naya admin user banaya ja raha hai...');
        const adminUser = new User({
            username: adminUsername,
            password: adminPassword, // Yeh password khud-ba-khud hash ho jayega
        });
        await adminUser.save();
        console.log(`Admin user kamyabi se ban gaya hai (username: ${adminUsername})`);

        // --- Seeding Other Collections ---
        // Baqi tamam data ek saath parallel mein insert karein.
        console.log('Naya data seed kiya ja raha hai...');
        await Promise.all([
            Student.insertMany(studentsData),
            Teacher.insertMany(teachersData),
            Assignment.insertMany(assignmentsData),
            SubjectNotes.insertMany(formatNotesData(notesData)),
            Quiz.insertMany(formatQuizData(quizData)),
            Download.insertMany(downloadsData),
            Gallery.insertMany(galleryData),
        ]);
        console.log('Tamam naya data kamyabi se daal diya gaya hai!');

    } catch (error) {
        console.error('Seeding mein sangeen masla hai:', error);
        process.exit(1); // Error ke case mein script ko exit karein
    } finally {
        await mongoose.connection.close();
        console.log('Database connection band kar diya gaya hai.');
    }
};

seedDatabase();
