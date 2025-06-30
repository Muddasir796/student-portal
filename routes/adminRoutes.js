// routes/adminRoutes.js (Final Corrected Version)

const express = require('express');
const router = express.Router();

const { isAdmin } = require('../middleware/authMiddleware.js');
const { studentValidationRules, teacherValidationRules, assignmentValidationRules, noteSubjectValidationRules, noteValidationRules, changePasswordValidationRules, downloadValidationRules, galleryValidationRules, quizQuestionValidationRules } = require('../middleware/adminValidationMiddleware.js');
const createUploader = require('../middleware/uploadMiddleware.js');

// --- Uploader Instances ---
// Har module ke liye alag uploader banayein
const studentUploader = createUploader('students'); // Default uploader for images
const teacherUploader = createUploader('teachers'); // Default uploader for images
const assignmentUploader = createUploader('assignments', /pdf|doc|docx|txt|png|jpg|jpeg/);
const downloadUploader = createUploader('downloads', /pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|txt|png|jpg|jpeg/);
const galleryUploader = createUploader('gallery'); // Uses default image filter
const quizUploader = createUploader('quiz_uploads', /csv/);

const { 
    getAdminDashboard, getChangePasswordPage, postChangePassword,
    getStudentsPage, getAddStudentPage, postAddStudent, getEditStudentPage, postUpdateStudent, deleteStudent,
    getTeachersPage, getAddTeacherPage, postAddTeacher, getEditTeacherPage, postUpdateTeacher, deleteTeacher,
    getAssignmentsPage, getAddAssignmentPage, postAddAssignment, getEditAssignmentPage, postUpdateAssignment, deleteAssignment,
    getNotesPage, getAddNoteSubjectPage, postAddNoteSubject, getEditNoteSubjectPage, postAddNoteToSubject, deleteNoteFromSubject, deleteSubject,
    getDownloadsPage, getAddDownloadPage, postAddDownload, getEditDownloadPage, postUpdateDownload, deleteDownload,
    getGalleryPage, getAddGalleryImagePage, postAddGalleryImage, getEditGalleryImagePage, postUpdateGalleryImage, deleteGalleryImage,
    getQuizPage, getEditQuizPage, postAddQuizQuestion, deleteQuizQuestion, postBulkUploadQuiz
} = require('../controllers/adminController.js');

// --- Admin Dashboard & Profile ---
router.get('/', isAdmin, (req, res) => res.redirect('/admin/dashboard'));
router.get('/dashboard', isAdmin, getAdminDashboard);
router.route('/change-password').get(isAdmin, getChangePasswordPage).post(isAdmin, changePasswordValidationRules(), postChangePassword);

// --- Student Management (CRUD) ---
router.get('/students', isAdmin, getStudentsPage);
router.route('/students/add').get(isAdmin, getAddStudentPage).post(isAdmin, studentUploader.single('profileImage'), studentValidationRules(), postAddStudent);
router.route('/students/edit/:id').get(isAdmin, getEditStudentPage).post(isAdmin, studentUploader.single('profileImage'), studentValidationRules(), postUpdateStudent);
router.get('/students/delete/:id', isAdmin, deleteStudent);

// --- Teacher Management (CRUD) ---
router.get('/teachers', isAdmin, getTeachersPage);
router.route('/teachers/add').get(isAdmin, getAddTeacherPage).post(isAdmin, teacherUploader.single('profileImage'), teacherValidationRules(), postAddTeacher);
router.route('/teachers/edit/:id').get(isAdmin, getEditTeacherPage).post(isAdmin, teacherUploader.single('profileImage'), teacherValidationRules(), postUpdateTeacher);
router.get('/teachers/delete/:id', isAdmin, deleteTeacher);

// --- Assignment Management (CRUD) ---
router.get('/assignments', isAdmin, getAssignmentsPage);
router.route('/assignments/add').get(isAdmin, getAddAssignmentPage).post(isAdmin, assignmentUploader.single('file'), assignmentValidationRules(), postAddAssignment);
router.route('/assignments/edit/:id').get(isAdmin, getEditAssignmentPage).post(isAdmin, assignmentUploader.single('file'), assignmentValidationRules(), postUpdateAssignment);
router.get('/assignments/delete/:id', isAdmin, deleteAssignment);

// --- Notes Management (CRUD) ---
router.get('/notes', isAdmin, getNotesPage);
router.route('/notes/add-subject').get(isAdmin, getAddNoteSubjectPage).post(isAdmin, noteSubjectValidationRules(), postAddNoteSubject);
router.route('/notes/edit/:slug').get(isAdmin, getEditNoteSubjectPage);
router.post('/notes/edit/:slug/add-note', isAdmin, noteValidationRules(), postAddNoteToSubject);
router.get('/notes/edit/:slug/delete-note/:noteId', isAdmin, deleteNoteFromSubject);
router.get('/notes/delete/:id', isAdmin, deleteSubject);

// --- Downloads Management (CRUD) ---
router.get('/downloads', isAdmin, getDownloadsPage);
router.route('/downloads/add').get(isAdmin, getAddDownloadPage).post(isAdmin, downloadUploader.single('file'), downloadValidationRules(), postAddDownload);
router.route('/downloads/edit/:id').get(isAdmin, getEditDownloadPage).post(isAdmin, downloadUploader.single('file'), downloadValidationRules(), postUpdateDownload);
router.get('/downloads/delete/:id', isAdmin, deleteDownload);

// --- Gallery Management (CRUD) ---
router.get('/gallery', isAdmin, getGalleryPage);
router.route('/gallery/add').get(isAdmin, getAddGalleryImagePage).post(isAdmin, galleryUploader.single('image'), galleryValidationRules(), postAddGalleryImage);
router.route('/gallery/edit/:id').get(isAdmin, getEditGalleryImagePage).post(isAdmin, galleryUploader.single('image'), galleryValidationRules(), postUpdateGalleryImage);
router.get('/gallery/delete/:id', isAdmin, deleteGalleryImage);

// --- Quiz Management ---
router.get('/quiz', isAdmin, getQuizPage);
router.get('/quiz/edit/:lang', isAdmin, getEditQuizPage);
router.post('/quiz/upload/:lang', isAdmin, quizUploader.single('quizFile'), postBulkUploadQuiz);
router.post('/quiz/edit/:lang/add', isAdmin, quizQuestionValidationRules(), postAddQuizQuestion);
router.get('/quiz/edit/:lang/delete/:questionId', isAdmin, deleteQuizQuestion);

module.exports = router;
