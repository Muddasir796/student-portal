// controllers/apiController.js
const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const Feedback = require('../models/Feedback');

const submitFeedback = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, message } = req.body;

    await Feedback.create({ name, email, message });

    res.status(201).json({ success: true, message: 'Thank you for your feedback! It has been received.' });
});

module.exports = {
    submitFeedback,
};
