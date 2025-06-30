// models/Student.js

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Student ka naam zaroori hai'],
        trim: true
    },
    rollNumber: {
        type: String,
        required: [true, 'Roll number zaroori hai'],
        unique: true, // Har student ka roll number alag hona chahiye
        trim: true
    },
    class: { 
        type: String, 
        required: true, 
        trim: true 
    },
    contact: { 
        type: String, 
        trim: true 
    },
    address: { 
        type: String, 
        required: true, 
        trim: true 
    },
    profileImage: {
        type: String,
        default: '/images/default-avatar.png' // Default image agar koi upload na ho
    },
    birthday: {
        type: Date,
        required: false
    }
}, { 
    timestamps: true // Yeh `createdAt` aur `updatedAt` fields khud-ba-khud manage karega
});

studentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Student', studentSchema);
