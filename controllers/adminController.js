// controllers/adminController.js (Updated to handle language parameter)

const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Assignment = require('../models/Assignment');
// Note: Baqi models abhi istemal nahi ho rahe, lekin hum unhein baad mein add kar sakte hain.

// =================================================================
// Helper function to get language from request
// =================================================================
const getLanguage = (req) => {
    // URL se 'lang' query parameter hasil karein, agar nahi hai to 'en' default istemal karein
    return req.query.lang === 'ur' ? 'ur' : 'en';
};


// =================================================================
// ADMIN DASHBOARD & PROFILE
// =================================================================

const getAdminDashboard = async (req, res) => {
    try {
        const lang = getLanguage(req);
        const [studentCount, teacherCount, assignmentCount] = await Promise.all([
            Student.countDocuments(), Teacher.countDocuments(), Assignment.countDocuments()
        ]);
        res.render('admin/dashboard', {
            layout: 'admin/layout',
            pageTitle: 'Admin Dashboard',
            lang, // Language ko view mein bhejein
            studentCount,
            teacherCount,
            assignmentCount
        });
    } catch (error) {
        console.error("Admin dashboard load karne mein masla hai:", error);
        res.status(500).send("Server Error");
    }
};

const getChangePasswordPage = (req, res) => {
    const lang = getLanguage(req);
    res.render('admin/change-password', {
        layout: 'admin/layout',
        pageTitle: 'Change Password',
        lang,
        error: null,
        success: null
    });
};

const postChangePassword = async (req, res) => {
    const lang = getLanguage(req);
    // (Password change ka logic waisa hi rahega)
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const userId = req.session.userId;
        if (newPassword !== confirmPassword) {
            return res.render('admin/change-password', { layout: 'admin/layout', pageTitle: 'Change Password', lang, error: "New passwords do not match." });
        }
        const user = await User.findById(userId);
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.render('admin/change-password', { layout: 'admin/layout', pageTitle: 'Change Password', lang, error: "Incorrect current password." });
        }
        user.password = newPassword;
        await user.save();
        res.render('admin/change-password', { layout: 'admin/layout', pageTitle: 'Change Password', lang, success: "Password changed successfully!" });
    } catch (error) {
        console.error("Password change karne mein masla hai:", error);
        res.render('admin/change-password', { layout: 'admin/layout', pageTitle: 'Change Password', lang, error: "An error occurred." });
    }
};

// =================================================================
// STUDENT & OTHER MANAGEMENT
// =================================================================
const getStudentsPage = async (req, res) => {
    const lang = getLanguage(req);
    try {
        const students = await Student.find({}).sort({ createdAt: -1 });
        res.render('admin/students', { layout: 'admin/layout', pageTitle: 'Manage Students', students, lang });
    } catch (error) {
        console.error("Error loading students page:", error);
        res.status(500).send("Server Error");
    }
};

const getTeachersPage = async (req, res) => {
    const lang = getLanguage(req);
    try {
        const teachers = await Teacher.find({}).sort({ createdAt: -1 });
        res.render('admin/teachers', { layout: 'admin/layout', pageTitle: 'Manage Teachers', teachers, lang });
    } catch (error) {
        console.error("Error loading teachers page:", error);
        res.status(500).send("Server Error");
    }
};

const getAssignmentsPage = async (req, res) => {
    const lang = getLanguage(req);
    try {
        const assignments = await Assignment.find({}).sort({ dueDate: 1 });
        res.render('admin/assignments', { layout: 'admin/layout', pageTitle: 'Manage Assignments', assignments, lang });
    } catch (error) {
        console.error("Error loading assignments page:", error);
        res.status(500).send("Server Error");
    }
};

// Add/Edit/Delete functions ko abhi ke liye waisa hi rehne dein, hum unhein baad mein update kar sakte hain.
const getAddStudentPage = (req, res) => res.render('admin/add-student', { layout: 'admin/layout', pageTitle: 'Add New Student', lang: getLanguage(req) });
const postAddStudent = async (req, res) => { try { await new Student(req.body).save(); res.redirect('/admin/students'); } catch (error) { res.render('admin/add-student', { layout: 'admin/layout', pageTitle: 'Add New Student', lang: getLanguage(req), error: "Could not add student." }); } };
const getEditStudentPage = async (req, res) => { try { const student = await Student.findById(req.params.id); res.render('admin/edit-student', { layout: 'admin/layout', pageTitle: 'Edit Student', student, lang: getLanguage(req) }); } catch (error) { res.status(500).send("Server Error"); } };
const postUpdateStudent = async (req, res) => { try { await Student.findByIdAndUpdate(req.params.id, req.body); res.redirect('/admin/students'); } catch (error) { res.redirect(`/admin/students/edit/${req.params.id}`); } };
const deleteStudent = async (req, res) => { try { await Student.findByIdAndDelete(req.params.id); res.redirect('/admin/students'); } catch (error) { res.redirect('/admin/students'); } };
const getAddTeacherPage = (req, res) => res.render('admin/add-teacher', { layout: 'admin/layout', pageTitle: 'Add New Teacher', lang: getLanguage(req) });
const postAddTeacher = async (req, res) => { try { const { name_en, name_ur, subject_en, subject_ur, officeHours_en, officeHours_ur, photo } = req.body; await new Teacher({ name: { en: name_en, ur: name_ur }, subject: { en: subject_en, ur: subject_ur }, officeHours: { en: officeHours_en, ur: officeHours_ur }, photo }).save(); res.redirect('/admin/teachers'); } catch (error) { res.render('admin/add-teacher', { layout: 'admin/layout', pageTitle: 'Add New Teacher', lang: getLanguage(req), error: "Could not add teacher." }); } };
const getEditTeacherPage = async (req, res) => { try { const teacher = await Teacher.findById(req.params.id); res.render('admin/edit-teacher', { layout: 'admin/layout', pageTitle: 'Edit Teacher', teacher, lang: getLanguage(req) }); } catch (error) { res.status(500).send("Server Error"); } };
const postUpdateTeacher = async (req, res) => { try { const { name_en, name_ur, subject_en, subject_ur, officeHours_en, officeHours_ur, photo } = req.body; await Teacher.findByIdAndUpdate(req.params.id, { name: { en: name_en, ur: name_ur }, subject: { en: subject_en, ur: subject_ur }, officeHours: { en: officeHours_en, ur: officeHours_ur }, photo }); res.redirect('/admin/teachers'); } catch (error) { res.redirect(`/admin/teachers/edit/${req.params.id}`); } };
const deleteTeacher = async (req, res) => { try { await Teacher.findByIdAndDelete(req.params.id); res.redirect('/admin/teachers'); } catch (error) { res.redirect('/admin/teachers'); } };
const getAddAssignmentPage = (req, res) => res.render('admin/add-assignment', { layout: 'admin/layout', pageTitle: 'Add New Assignment', lang: getLanguage(req) });
const postAddAssignment = async (req, res) => { try { const { subject_en, subject_ur, task_en, task_ur, dueDate, completed } = req.body; await new Assignment({ subject: { en: subject_en, ur: subject_ur }, task: { en: task_en, ur: task_ur }, dueDate, completed: completed === 'true' }).save(); res.redirect('/admin/assignments'); } catch (error) { res.render('admin/add-assignment', { layout: 'admin/layout', pageTitle: 'Add New Assignment', lang: getLanguage(req), error: "Could not add assignment." }); } };
const getEditAssignmentPage = async (req, res) => { try { const assignment = await Assignment.findById(req.params.id); res.render('admin/edit-assignment', { layout: 'admin/layout', pageTitle: 'Edit Assignment', assignment, lang: getLanguage(req) }); } catch (error) { res.status(500).send("Server Error"); } };
const postUpdateAssignment = async (req, res) => { try { const { subject_en, subject_ur, task_en, task_ur, dueDate, completed } = req.body; await Assignment.findByIdAndUpdate(req.params.id, { subject: { en: subject_en, ur: subject_ur }, task: { en: task_en, ur: task_ur }, dueDate, completed: completed === 'true' }); res.redirect('/admin/assignments'); } catch (error) { res.redirect(`/admin/assignments/edit/${req.params.id}`); } };
const deleteAssignment = async (req, res) => { try { await Assignment.findByIdAndDelete(req.params.id); res.redirect('/admin/assignments'); } catch (error) { res.redirect('/admin/assignments'); } };

module.exports = {
    getAdminDashboard, getChangePasswordPage, postChangePassword,
    getStudentsPage, getAddStudentPage, postAddStudent, getEditStudentPage, postUpdateStudent, deleteStudent,
    getTeachersPage, getAddTeacherPage, postAddTeacher, getEditTeacherPage, postUpdateTeacher, deleteTeacher,
    getAssignmentsPage, getAddAssignmentPage, postAddAssignment, getEditAssignmentPage, postUpdateAssignment, deleteAssignment
};
