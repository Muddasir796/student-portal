// models/Note.js

const mongoose = require('mongoose');

// This is a "sub-document" schema. It defines the structure of a single note
// that will be embedded inside a Subject.
const noteSchema = new mongoose.Schema({
    title: {
        en: { type: String, required: true, trim: true },
        ur: { type: String, required: true, trim: true }
    },
    url: {
        type: String,
        required: [true, 'Note ka link (URL) zaroori hai'],
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// This is the main schema for a Subject that contains multiple notes.
const subjectNotesSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: [true, 'Slug zaroori hai (e.g., computer-science)'],
        unique: true,
        trim: true,
        lowercase: true
    },
    subject: {
        en: { type: String, required: true, trim: true },
        ur: { type: String, required: true, trim: true }
    },
    notes: [noteSchema] // This creates an array of note documents
}, {
    timestamps: true
});

module.exports = mongoose.model('SubjectNotes', subjectNotesSchema);