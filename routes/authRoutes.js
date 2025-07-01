// routes/authRoutes.js

const express = require('express');
const router = express.Router();

// Controller aur middleware import karein
const { renderLoginPage, loginUser, logoutUser } = require('../controllers/authController.js');
const { loginLimiter } = require('../middleware/rateLimiter.js');
const { isLoggedIn } = require('../middleware/authMiddleware.js');
const { loginValidationRules } = require('../middleware/adminValidationMiddleware.js');

// Jab '/login' par GET request aaye, to login page dikhao
router.get('/login', renderLoginPage);

// Jab '/login' par POST request aaye (form submit ho), to login logic chalao
router.post('/login', loginLimiter, loginValidationRules(), loginUser); // Yahan rate limiter aur validation dono lagaye gaye hain

// Logout ke liye route
router.get('/logout', isLoggedIn, logoutUser); // Sirf login user hi logout kar sakta hai

module.exports = router;
