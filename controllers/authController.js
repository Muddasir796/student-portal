// controllers/authController.js

const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { validationResult } = require('express-validator');

// Login page dikhane ka function
const renderLoginPage = (req, res) => {
    // Flash se anay wale validation errors aur purana input hasil karein
    const validationErrors = req.flash('validation_errors')[0] || [];
    const oldInput = req.flash('old_input')[0] || {};
    
    // Errors ko ek object mein tabdeel karein taake view mein istemal karna aasan ho
    const errors = {};
    validationErrors.forEach(err => {
        if (!errors[err.path]) {
            errors[err.path] = err.msg;
        }
    });

    res.render('login', { 
        layout: false, // Login page ka apna layout hai, isliye main layout istemal na karein
        errors: errors,
        oldInput: oldInput,
    });
};

// Login form submit hone par yeh function chalega
const loginUser = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const { username, password } = req.body;

    if (!errors.isEmpty()) {
        // Agar validation mein errors hain, to user ko wapas login page par bhej dein
        req.flash('validation_errors', errors.array());
        req.flash('old_input', { username }); // Security ke liye password wapas na bhejein
        return res.redirect('/login');
    }

    const user = await User.findOne({ username: username.toLowerCase().trim() });

    if (!user || !(await user.matchPassword(password))) {
        req.flash('error_msg', 'Username ya password ghalat hai.');
        req.flash('old_input', { username });
        return res.redirect('/login');
    }

    // Login Kamyab - Session Banayein
    req.session.userId = user._id;
    req.session.role = user.role;
    
    req.flash('success_msg', 'Aap kamyabi se login ho gaye hain. Khush Aamdeed!');
    res.redirect('/admin/dashboard');
});

// Logout ka function
const logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Logout mein masla:", err);
            return res.redirect('/');
        }
        res.clearCookie('connect.sid'); // Session cookie ko saaf karo
        req.flash('success_msg', 'Aap kamyabi se logout ho gaye hain.');
        res.redirect('/login');
    });
};


module.exports = {
    renderLoginPage,
    loginUser,
    logoutUser
};
