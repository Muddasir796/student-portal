// middleware/validationMiddleware.js

const { check, validationResult } = require('express-validator');

const validateLogin = [
    // Rule 1: username must not be empty.
    check('username').not().isEmpty().withMessage('Username is required.'),
    
    // Rule 2: password must not be empty.
    check('password').not().isEmpty().withMessage('Password is required.'),

    // Function to check for validation errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // If there are errors, re-render the login page with the first error message.
            return res.render('login', {
                error: errors.array()[0].msg
            });
        }
        next();
    }
];

module.exports = {
    validateLogin
};
