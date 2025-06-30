// models/Teacher.js

const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Teacher ka naam zaroori hai'],
        trim: true
    },
    designation: {
        type: String,
        required: [true, 'Ohda (Designation) likhna zaroori hai'],
        trim: true
    },
    subject: {
        type: String,
        required: [true, 'Mazmoon (Subject) likhna zaroori hai'],
        trim: true
    },
    contact: {
        type: String,
        trim: true
    },
    profileImage: {
        type: String,
        default: '/images/default-avatar.png' // Default image agar koi upload na ho
    }
}, {
    timestamps: true // Yeh `createdAt` aur `updatedAt` fields khud-ba-khud manage karega
});

module.exports = mongoose.model('Teacher', teacherSchema);