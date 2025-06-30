// routes/adminRoutes.js (Updated for complete Notes CRUD functionality)

const express = require('express');
const router = express.Router();

// Middleware (Security Guard) import karein
const { isAdmin } = require('../middleware/authMiddleware.js');

// Admin Controller se tamam zaroori functions import karein
const { 
    // Dashboard & Profile
    getAdminDashboard, getChangePasswordPage, postChangePassword,
    // Student Functions
    getStudentsPage, getAddStudentPage, postAddStudent, getEditStudentPage, postUpdateStudent, deleteStudent,
    // Teacher Functions
    getTeachersPage, getAddTeacherPage, postAddTeacher, getEditTeacherPage, postUpdateTeacher, deleteTeacher,
    // Assignment Functions
    getAssignmentsPage, getAddAssignmentPage, postAddAssignment, getEditAssignmentPage, postUpdateAssignment, deleteAssignment,
    // Notes Functions
    getNotesPage, getAddNoteSubjectPage, postAddNoteSubject, getEditNoteSubjectPage, postAddNoteToSubject, deleteNoteFromSubject, deleteSubject
} = require('../controllers/adminController.js');


// --- Admin Dashboard & Profile ---
router.get('/', isAdmin, (req, res) => res.redirect('/admin/dashboard'));
router.get('/dashboard', isAdmin, getAdminDashboard);
router.get('/change-password', isAdmin, getChangePasswordPage);
router.post('/change-password', isAdmin, postChangePassword);


// --- Student Management (CRUD) ---
router.get('/students', isAdmin, getStudentsPage);
router.get('/students/add', isAdmin, getAddStudentPage);
router.post('/students/add', isAdmin, postAddStudent);
router.get('/students/edit/:id', isAdmin, getEditStudentPage);
router.post('/students/edit/:id', isAdmin, postUpdateStudent);
router.get('/students/delete/:id', isAdmin, deleteStudent);


// --- Teacher Management (CRUD) ---
router.get('/teachers', isAdmin, getTeachersPage);
router.get('/teachers/add', isAdmin, getAddTeacherPage);
router.post('/teachers/add', isAdmin, postAddTeacher);
router.get('/teachers/edit/:id', isAdmin, getEditTeacherPage);
router.post('/teachers/edit/:id', isAdmin, postUpdateTeacher);
router.get('/teachers/delete/:id', isAdmin, deleteTeacher);


// --- Assignment Management (CRUD) ---
router.get('/assignments', isAdmin, getAssignmentsPage);
router.get('/assignments/add', isAdmin, getAddAssignmentPage);
router.post('/assignments/add', isAdmin, postAddAssignment);
router.get('/assignments/edit/:id', isAdmin, getEditAssignmentPage);
router.post('/assignments/edit/:id', isAdmin, postUpdateAssignment);
router.get('/assignments/delete/:id', isAdmin, deleteAssignment);


// --- Notes Management (CRUD) Routes ---
router.get('/notes', isAdmin, getNotesPage);
router.get('/notes/add-subject', isAdmin, getAddNoteSubjectPage);
router.post('/notes/add-subject', isAdmin, postAddNoteSubject);
router.get('/notes/edit/:slug', isAdmin, getEditNoteSubjectPage);
router.post('/notes/edit/:slug/add-note', isAdmin, postAddNoteToSubject);
router.get('/notes/edit/:slug/delete-note/:noteId', isAdmin, deleteNoteFromSubject);
router.get('/notes/delete/:id', isAdmin, deleteSubject); // Yeh poore subject ko delete karega


module.exports = router;
