// routes/authRoutes.js

const express = require('express');
const router = express.Router();

// Auth Controller se functions import karein
const { renderLoginPage, loginUser, logoutUser } = require('../controllers/authController');

// Jab '/login' par GET request aaye, to login page dikhao
router.get('/login', renderLoginPage);

// Jab '/login' par POST request aaye (form submit ho), to login logic chalao
router.post('/login', loginUser);

// Logout ke liye route
router.get('/logout', logoutUser);


module.exports = router;
