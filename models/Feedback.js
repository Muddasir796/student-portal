// models/Feedback.js

const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    message: {
        type: String,
        required: [true, 'Feedback message cannot be empty.'],
        trim: true,
        minlength: [10, 'Feedback must be at least 10 characters long.']
    },
    // Hum isay 'anonymous' rakhenge, lekin mustaqbil mein user ID save kar sakte hain
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
