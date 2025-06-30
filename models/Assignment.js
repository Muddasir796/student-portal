// models/Assignment.js

const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: {
        en: { type: String, required: true, trim: true },
        ur: { type: String, required: true, trim: true }
    },
    subject: {
        type: String,
        required: [true, 'Mazmoon (Subject) likhna zaroori hai'],
        trim: true
    },
    description: {
        en: { type: String, required: true, trim: true },
        ur: { type: String, required: true, trim: true }
    },
    deadline: {
        type: Date,
        required: [true, 'Aakhri tareekh (Deadline) zaroori hai']
    },
    file: {
        type: String, // Path to the uploaded assignment file
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Assignment', assignmentSchema);
