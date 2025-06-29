// routes/apiRoutes.js

const express = require('express');
const router = express.Router();

// API Controller se 'submitFeedback' function import karein
const { submitFeedback } = require('../controllers/apiController.js');

// Jab is route par POST request aaye, to submitFeedback function chalao
// Poora URL banega: /api/feedback
router.post('/feedback', submitFeedback);

// Is router ko export karein
module.exports = router;
