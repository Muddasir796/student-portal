// controllers/apiController.js

const Feedback = require('../models/Feedback.js');

// Feedback submit karne ka logic
const submitFeedback = async (req, res) => {
    try {
        // Validation ab middleware mein ho rahi hai.
        const { message } = req.body;

        const newFeedback = new Feedback({ message });
        await newFeedback.save();

        res.status(201).json({ success: true, message: 'Feedback submitted successfully!' });

    } catch (error) {
        console.error('Feedback submission mein masla hai:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
};

module.exports = {
    submitFeedback,
};
