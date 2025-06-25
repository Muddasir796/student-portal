// models/Student.js

const mongoose = require('mongoose');

// 1. Schema Definition (Data ka Naqsha)
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Student ka naam zaroori hai'], // Name is required
        trim: true // Faltu spaces ko hata dega
    },
    semester: {
        type: Number,
        required: [true, 'Semester zaroori hai'],
        min: [1, 'Semester 1 se kam nahi ho sakta'],
        max: [8, 'Semester 8 se zyada nahi ho sakta']
    },
    photo: {
        type: String,
        default: 'https://placehold.co/400x400/eee/ccc?text=No+Image' // Default image if none is provided
    },
    birthday: {
        type: Date,
        required: true
    },
    // Yeh field khud-ba-khud set ho jayegi jab data create hoga
    createdAt: {
        type: Date,
        default: Date.now 
    }
});

// 2. Model Creation (Schema se Tool Banana)
// 'Student' naam ka model banayein jo studentSchema ko istemal karega.
// Mongoose isay database mein 'students' (plural) naam ka collection bana dega.
const Student = mongoose.model('Student', studentSchema);

// 3. Model ko Export Karein
module.exports = Student;
