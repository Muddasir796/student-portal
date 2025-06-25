// routes/adminRoutes.js (Updated for Change Password functionality)

const express = require('express');
const router = express.Router();

// Middleware (Security Guard) import karein
const { isAdmin } = require('../middleware/authMiddleware.js');

// Admin Controller se tamam zaroori functions import karein
const { 
    getAdminDashboard,
    getChangePasswordPage,
    postChangePassword,
    // Student Functions
    getStudentsPage, getAddStudentPage, postAddStudent, getEditStudentPage, postUpdateStudent, deleteStudent,
    // Teacher Functions
    getTeachersPage, getAddTeacherPage, postAddTeacher, getEditTeacherPage, postUpdateTeacher, deleteTeacher,
    // Assignment Functions
    getAssignmentsPage, getAddAssignmentPage, postAddAssignment, getEditAssignmentPage, postUpdateAssignment, deleteAssignment
} = require('../controllers/adminController.js');


// --- Admin Dashboard & Profile Routes ---
router.get('/', isAdmin, (req, res) => res.redirect('/admin/dashboard'));
router.get('/dashboard', isAdmin, getAdminDashboard);
router.get('/change-password', isAdmin, getChangePasswordPage); // Page dikhane ke liye (GET)
router.post('/change-password', isAdmin, postChangePassword); // Form submit karne ke liye (POST)


// --- Student Management (CRUD) Routes ---
router.get('/students', isAdmin, getStudentsPage);
router.get('/students/add', isAdmin, getAddStudentPage);
router.post('/students/add', isAdmin, postAddStudent);
router.get('/students/edit/:id', isAdmin, getEditStudentPage);
router.post('/students/edit/:id', isAdmin, postUpdateStudent);
router.get('/students/delete/:id', isAdmin, deleteStudent);


// --- Teacher Management (CRUD) Routes ---
router.get('/teachers', isAdmin, getTeachersPage);
router.get('/teachers/add', isAdmin, getAddTeacherPage);
router.post('/teachers/add', isAdmin, postAddTeacher);
router.get('/teachers/edit/:id', isAdmin, getEditTeacherPage);
router.post('/teachers/edit/:id', isAdmin, postUpdateTeacher);
router.get('/teachers/delete/:id', isAdmin, deleteTeacher);


// --- Assignment Management (CRUD) Routes ---
router.get('/assignments', isAdmin, getAssignmentsPage);
router.get('/assignments/add', isAdmin, getAddAssignmentPage);
router.post('/assignments/add', isAdmin, postAddAssignment);
router.get('/assignments/edit/:id', isAdmin, getEditAssignmentPage);
router.post('/assignments/edit/:id', isAdmin, postUpdateAssignment);
router.get('/assignments/delete/:id', isAdmin, deleteAssignment);


module.exports = router;
