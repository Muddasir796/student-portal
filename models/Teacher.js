// models/Teacher.js

const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    // Hum name aur subject ko nested objects mein rakhenge taake English aur Urdu dono variants store kar sakein.
    name: {
        en: { type: String, required: true, trim: true },
        ur: { type: String, required: true, trim: true }
    },
    subject: {
        en: { type: String, required: true, trim: true },
        ur: { type: String, required: true, trim: true }
    },
    photo: {
        type: String,
        default: 'https://placehold.co/400x400/eee/ccc?text=No+Image'
    },
    officeHours: {
        en: { type: String, required: true },
        ur: { type: String, required: true }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
