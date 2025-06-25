// controllers/studentController.js

// 1. Data folder se students ka data import karein
const studentsData = require('../data/students.js');

// 2. Ek function banayein jo tamam students ka data bhejega
// Yeh hamari request ka logic hai
const getAllStudents = (req, res) => {
    // res.json() function data ko JSON format mein client ko bhejta hai
    res.json(studentsData);
};

// 3. Is function ko doosri files mein istemal ke liye export karein
module.exports = {
    getAllStudents,
};
