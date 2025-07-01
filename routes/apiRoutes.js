// routes/apiRoutes.js

const express = require('express');
const router = express.Router();

// API Controller se 'submitFeedback' function import karein
const { submitFeedback } = require('../controllers/apiController.js');
const { feedbackValidationRules } = require('../middleware/apiValidationMiddleware.js');

// Jab is route par POST request aaye, to submitFeedback function chalao
// Poora URL banega: /api/feedback
router.post('/feedback', feedbackValidationRules(), submitFeedback);

module.exports = router;
