// routes/apiRoutes.js

const express = require('express');
const router = express.Router();

// Controller aur naye Middleware ko import karein
const { submitFeedback } = require('../controllers/apiController.js');
const { validateFeedback } = require('../middleware/apiValidationMiddleware.js');

// Route: /api/feedback
// Pehle 'validateFeedback' middleware chalega, agar woh pass hoga tab hi 'submitFeedback' chalega.
router.post('/feedback', validateFeedback, submitFeedback);

module.exports = router;
