// controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Login page dikhane ka function
const renderLoginPage = (req, res) => {
    // 'login.ejs' file ko render karo
    res.render('login', { error: null });
};

// Login form submit hone par yeh function chalega
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. User ko database mein dhoondo
        const user = await User.findOne({ username: username.toLowerCase() });
        if (!user) {
            // Agar user nahi mila
            return res.render('login', { error: 'Invalid username or password.' });
        }

        // 2. Password ko compare karo
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Agar password ghalat hai
            return res.render('login', { error: 'Invalid username or password.' });
        }

        // 3. Login Kamyab - Session Banayein
        // Hum user ki ID session mein save kar lenge
        req.session.userId = user._id;
        req.session.role = user.role;
        
        // User ko admin dashboard par redirect karein
        // Hum yeh dashboard agle qadam mein banayenge
        res.redirect('/admin/dashboard');

    } catch (error) {
        console.error("Login mein masla hai:", error);
        res.render('login', { error: 'An error occurred. Please try again.' });
    }
};

// Logout ka function
const logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/'); // Agar error ho to home page par bhej do
        }
        res.clearCookie('connect.sid'); // Session cookie ko saaf karo
        res.redirect('/login'); // Login page par bhej do
    });
};


module.exports = {
    renderLoginPage,
    loginUser,
    logoutUser
};
