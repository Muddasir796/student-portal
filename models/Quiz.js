// models/Quiz.js

const mongoose = require('mongoose');

// This is a "sub-document" schema for a single question.
const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    answer: { type: String, required: true }
});

// This is the main schema for a quiz, which is tied to a language.
const quizSchema = new mongoose.Schema({
    language: { 
        type: String, 
        required: true, 
        unique: true,
        enum: ['en', 'ur'] // Only allow 'en' or 'ur' as languages
    },
    questions: [questionSchema] // An array of question documents
});

module.exports = mongoose.model('Quiz', quizSchema);