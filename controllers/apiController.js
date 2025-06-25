// controllers/apiController.js

// Feedback model ko import karein
const Feedback = require('../models/Feedback.js');

// Feedback submit karne ka logic
const submitFeedback = async (req, res) => {
    try {
        // req.body se message hasil karein (yeh front-end se aayega)
        const { message } = req.body;

        // Validation: Check karein ke message maujood hai
        if (!message) {
            // Agar message nahi hai, to error bhejein
            return res.status(400).json({ success: false, message: 'Feedback message is required.' });
        }

        // Naya feedback document banayein
        const newFeedback = new Feedback({
            message: message
        });

        // Database mein save karein
        await newFeedback.save();

        // Kamyabi ka response bhejein
        res.status(201).json({ success: true, message: 'Feedback submitted successfully!' });

    } catch (error) {
        // Agar koi error aaye (jaise validation fail ho jaye)
        console.error('Feedback submission mein masla hai:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
};

// Is function ko export karein
module.exports = {
    submitFeedback,
};
