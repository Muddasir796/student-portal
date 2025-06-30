// routes/adminRoutes.js (Final Corrected Version)

const express = require('express');
const router = express.Router();

const { isAdmin } = require('../middleware/authMiddleware.js');

const { 
    getAdminDashboard, getChangePasswordPage, postChangePassword,
    getStudentsPage, getAddStudentPage, postAddStudent, getEditStudentPage, postUpdateStudent, deleteStudent,
    getTeachersPage, getAddTeacherPage, postAddTeacher, getEditTeacherPage, postUpdateTeacher, deleteTeacher,
    getAssignmentsPage, getAddAssignmentPage, postAddAssignment, getEditAssignmentPage, postUpdateAssignment, deleteAssignment,
    getNotesPage, getAddNoteSubjectPage, postAddNoteSubject, getEditNoteSubjectPage, postAddNoteToSubject, deleteNoteFromSubject, deleteSubject
} = require('../controllers/adminController.js');

// --- Admin Dashboard & Profile ---
router.get('/', isAdmin, (req, res) => res.redirect('/admin/dashboard'));
router.get('/dashboard', isAdmin, getAdminDashboard);
router.route('/change-password').get(isAdmin, getChangePasswordPage).post(isAdmin, postChangePassword);

// --- Student Management (CRUD) ---
router.get('/students', isAdmin, getStudentsPage);
router.route('/students/add').get(isAdmin, getAddStudentPage).post(isAdmin, postAddStudent);
router.route('/students/edit/:id').get(isAdmin, getEditStudentPage).post(isAdmin, postUpdateStudent);
router.get('/students/delete/:id', isAdmin, deleteStudent);

// --- Teacher Management (CRUD) ---
router.get('/teachers', isAdmin, getTeachersPage);
router.route('/teachers/add').get(isAdmin, getAddTeacherPage).post(isAdmin, postAddTeacher);
router.route('/teachers/edit/:id').get(isAdmin, getEditTeacherPage).post(isAdmin, postUpdateTeacher);
router.get('/teachers/delete/:id', isAdmin, deleteTeacher);

// --- Assignment Management (CRUD) ---
router.get('/assignments', isAdmin, getAssignmentsPage);
router.route('/assignments/add').get(isAdmin, getAddAssignmentPage).post(isAdmin, postAddAssignment);
router.route('/assignments/edit/:id').get(isAdmin, getEditAssignmentPage).post(isAdmin, postUpdateAssignment);
router.get('/assignments/delete/:id', isAdmin, deleteAssignment);

// --- Notes Management (CRUD) ---
router.get('/notes', isAdmin, getNotesPage);
router.route('/notes/add-subject').get(isAdmin, getAddNoteSubjectPage).post(isAdmin, postAddNoteSubject);
router.route('/notes/edit/:slug').get(isAdmin, getEditNoteSubjectPage);
router.post('/notes/edit/:slug/add-note', isAdmin, postAddNoteToSubject);
router.get('/notes/edit/:slug/delete-note/:noteId', isAdmin, deleteNoteFromSubject);
router.get('/notes/delete/:id', isAdmin, deleteSubject);

module.exports = router;
