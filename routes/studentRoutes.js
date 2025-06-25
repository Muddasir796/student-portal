// routes/studentRoutes.js

const express = require('express');
const router = express.Router();

// 1. Controller se 'getAllStudents' function import karein
const { getAllStudents } = require('../controllers/studentController.js');

// 2. Route define karein
// Jab is route par GET request aaye, to getAllStudents function chalao
router.get('/', getAllStudents);

// 3. Is router ko doosri files mein istemal ke liye export karein
module.exports = router;
