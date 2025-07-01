// middleware/apiValidationMiddleware.js
const { body } = require('express-validator');

const feedbackValidationRules = () => {
    return [
        body('name', 'Name is required.').trim().notEmpty().escape(),
        body('email', 'A valid email is required.').isEmail().normalizeEmail(),
        body('message', 'Message cannot be empty.').trim().notEmpty().escape(),
    ];
};

module.exports = {
    feedbackValidationRules,
};
