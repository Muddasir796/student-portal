// controllers/adminController.js

const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Assignment = require('../models/Assignment');
const SubjectNotes = require('../models/Note');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Helper function to get language from request
const getLanguage = (req) => req.query.lang === 'ur' ? 'ur' : 'en';

// ADMIN DASHBOARD & PROFILE
const getAdminDashboard = async (req, res) => { /* ... code ... */ };
const getChangePasswordPage = (req, res) => { /* ... code ... */ };
const postChangePassword = async (req, res) => { /* ... code ... */ };

// STUDENT MANAGEMENT
const getStudentsPage = async (req, res) => { /* ... code ... */ };
const getAddStudentPage = (req, res) => { /* ... code ... */ };
const postAddStudent = async (req, res) => { /* ... code ... */ };
const getEditStudentPage = async (req, res) => { /* ... code ... */ };
const postUpdateStudent = async (req, res) => { /* ... code ... */ };
const deleteStudent = async (req, res) => { /* ... code ... */ };

// TEACHER MANAGEMENT
const getTeachersPage = async (req, res) => { /* ... code ... */ };
const getAddTeacherPage = (req, res) => { /* ... code ... */ };
const postAddTeacher = async (req, res) => { /* ... code ... */ };
const getEditTeacherPage = async (req, res) => { /* ... code ... */ };
const postUpdateTeacher = async (req, res) => { /* ... code ... */ };
const deleteTeacher = async (req, res) => { /* ... code ... */ };

// ASSIGNMENT MANAGEMENT
const getAssignmentsPage = async (req, res) => { /* ... code ... */ };
const getAddAssignmentPage = (req, res) => { /* ... code ... */ };
const postAddAssignment = async (req, res) => { /* ... code ... */ };
const getEditAssignmentPage = async (req, res) => { /* ... code ... */ };
const postUpdateAssignment = async (req, res) => { /* ... code ... */ };
const deleteAssignment = async (req, res) => { /* ... code ... */ };

// NOTES MANAGEMENT
const getNotesPage = async (req, res) => {
    try {
        const subjects = await SubjectNotes.find({}).sort({ 'subject.en': 1 });
        res.render('admin/notes', {
            layout: 'admin/layout', pageTitle: 'Manage Notes',
            subjects: subjects, lang: getLanguage(req)
        });
    } catch (error) { console.error("Error loading notes page:", error); res.status(500).send("Server Error"); }
};

const getAddNoteSubjectPage = (req, res) => {
    res.render('admin/add-note-subject', { layout: 'admin/layout', pageTitle: 'Add New Subject Notes', lang: getLanguage(req) });
};

const postAddNoteSubject = async (req, res) => {
    try {
        const { subject_en, subject_ur, slug, note_title_en, note_title_ur, note_url, note_date } = req.body;
        const newSubject = new SubjectNotes({
            slug, subject: { en: subject_en, ur: subject_ur },
            notes: [{ title: { en: note_title_en, ur: note_title_ur }, url: note_url, date: note_date }]
        });
        await newSubject.save();
        res.redirect('/admin/notes');
    } catch (error) { console.error("Error adding subject notes:", error); res.status(500).send("Server Error"); }
};

const getEditNoteSubjectPage = async (req, res) => {
    try {
        const subject = await SubjectNotes.findOne({ slug: req.params.slug });
        if (!subject) return res.status(404).send('Subject not found');
        res.render('admin/edit-note-subject', {
            layout: 'admin/layout', pageTitle: `Edit: ${subject.subject.en}`,
            subject: subject, lang: getLanguage(req)
        });
    } catch (error) { console.error("Error loading edit notes page:", error); res.status(500).send("Server Error"); }
};

const postAddNoteToSubject = async (req, res) => {
    try {
        const subject = await SubjectNotes.findOne({ slug: req.params.slug });
        subject.notes.push({
            title: { en: req.body.note_title_en, ur: req.body.note_title_ur },
            url: req.body.note_url, date: req.body.note_date
        });
        await subject.save();
        res.redirect(`/admin/notes/edit/${req.params.slug}`);
    } catch (error) { console.error("Error adding note to subject:", error); res.status(500).send("Server Error"); }
};

const deleteNoteFromSubject = async (req, res) => {
    try {
        await SubjectNotes.updateOne({ slug: req.params.slug }, { $pull: { notes: { _id: req.params.noteId } } });
        res.redirect(`/admin/notes/edit/${req.params.slug}`);
    } catch (error) { console.error("Error deleting note from subject:", error); res.status(500).send("Server Error"); }
};

const deleteSubject = async (req, res) => {
    try {
        await SubjectNotes.findByIdAndDelete(req.params.id);
        res.redirect('/admin/notes');
    } catch (error) { console.error("Error deleting subject:", error); res.redirect('/admin/notes'); }
};

// Exports
module.exports = {
    getAdminDashboard, getChangePasswordPage, postChangePassword,
    getStudentsPage, getAddStudentPage, postAddStudent, getEditStudentPage, postUpdateStudent, deleteStudent,
    getTeachersPage, getAddTeacherPage, postAddTeacher, getEditTeacherPage, postUpdateTeacher, deleteTeacher,
    getAssignmentsPage, getAddAssignmentPage, postAddAssignment, getEditAssignmentPage, postUpdateAssignment, deleteAssignment,
    getNotesPage, getAddNoteSubjectPage, postAddNoteSubject, getEditNoteSubjectPage, postAddNoteToSubject, deleteNoteFromSubject, deleteSubject
};
