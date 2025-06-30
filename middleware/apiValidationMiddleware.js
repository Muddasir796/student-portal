// middleware/apiValidationMiddleware.js

const { check, validationResult } = require('express-validator');

const validateFeedback = [
    // Rule: message field must not be empty and must be at least 10 characters long.
    check('message')
        .trim()
        .not().isEmpty().withMessage('Feedback message cannot be empty.')
        .isLength({ min: 10 }).withMessage('Feedback must be at least 10 characters long.'),

    // Function to check for validation errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // If there are errors, send a 400 Bad Request response with the errors.
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateFeedback
};
