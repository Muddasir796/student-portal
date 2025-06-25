// models/Quiz.js

const mongoose = require('mongoose');

// Yeh ek sawal (question) ka schema hai
const singleQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: {
        type: [String], // Array of strings
        required: true
    },
    answer: {
        type: String,
        required: true
    }
}, { _id: false }); // Sub-documents ke liye _id ki zaroorat nahi

// Yeh poore Quiz ka schema hai
const quizSchema = new mongoose.Schema({
    language: {
        type: String,
        required: true,
        enum: ['en', 'ur'], // Language ya to 'en' hogi ya 'ur'
        unique: true
    },
    questions: [singleQuestionSchema]
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
