// models/Assignment.js

const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    subject: {
        en: { type: String, required: true },
        ur: { type: String, required: true }
    },
    task: {
        en: { type: String, required: true },
        ur: { type: String, required: true }
    },
    dueDate: {
        type: Date,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
