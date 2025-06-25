// models/Note.js

const mongoose = require('mongoose');

// Yeh ek note ka schema hai (jo array ke andar hoga)
const singleNoteSchema = new mongoose.Schema({
    title: {
        en: { type: String, required: true },
        ur: { type: String, required: true }
    },
    url: {
        type: String,
        required: true,
        default: '#'
    },
    date: {
        type: Date,
        required: true
    }
});

// Yeh poore subject ke notes ka schema hai
const subjectNotesSchema = new mongoose.Schema({
    // Maslan: 'quranic-studies', 'hadith-literature'
    slug: {
        type: String,
        required: true,
        unique: true, // Har subject ka slug unique hoga
        trim: true
    },
    subject: {
        en: { type: String, required: true },
        ur: { type: String, required: true }
    },
    // Yahan hum upar wale singleNoteSchema ko as an array istemal kar rahe hain
    notes: [singleNoteSchema] 
});

const SubjectNotes = mongoose.model('SubjectNotes', subjectNotesSchema);

module.exports = SubjectNotes;
