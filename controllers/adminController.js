// controllers/adminController.js

const csv = require('csv-parser');
const { validationResult } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const fs = require('fs');
const path = require('path');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Assignment = require('../models/Assignment');
const SubjectNotes = require('../models/Note');
const User = require('../models/User');
const Download = require('../models/Download');
const Gallery = require('../models/Gallery');
const Quiz = require('../models/Quiz');
const Feedback = require('../models/Feedback');

// Helper function to get language from request
const getLanguage = (req) => req.query.lang === 'ur' ? 'ur' : 'en';

// ADMIN DASHBOARD & PROFILE
const getAdminDashboard = asyncHandler(async (req, res) => {
    const studentCount = await Student.countDocuments();
    const teacherCount = await Teacher.countDocuments();
    const assignmentCount = await Assignment.countDocuments();
    
    res.render('admin/dashboard', {
        title: 'Admin Dashboard',
        layout: 'layouts/admin',
        studentCount,
        teacherCount,
        assignmentCount
    });
});

const getChangePasswordPage = (req, res) => {
    const validationErrors = req.flash('validation_errors')[0] || [];
    const errors = {};
    validationErrors.forEach(err => {
        if (!errors[err.path]) {
            errors[err.path] = err.msg;
        }
    });

    res.render('admin/change-password', {
        title: 'Password Tabdeel Karein',
        layout: 'layouts/admin',
        errors,
    });
};

const postChangePassword = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('validation_errors', errors.array());
        return res.redirect('/admin/change-password');
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.session.userId);

    if (!user || !(await user.matchPassword(currentPassword))) {
        req.flash('error_msg', 'Your current password is incorrect.');
        return res.redirect('/admin/change-password');
    }

    user.password = newPassword; // The pre-save hook in the User model will hash this
    await user.save();

    req.flash('success_msg', 'Password has been changed successfully.');
    res.redirect('/admin/dashboard');
});

// STUDENT MANAGEMENT
const getStudentsPage = asyncHandler(async (req, res) => {
    const searchTerm = req.query.search || '';
    let filter = {};

    if (searchTerm) {
        const regex = new RegExp(searchTerm, 'i'); // 'i' for case-insensitive
        filter = {
            $or: [
                { name: regex },
                { rollNumber: regex },
                { class: regex }
            ]
        };
    }

    const options = {
        page: req.query.page || 1,
        limit: 10, // Har page par 10 records dikhayein
        sort: { createdAt: -1 },
        lean: true
    };

    const result = await Student.paginate(filter, options);

    res.render('admin/manage-students', {
        title: 'Students Manage Karein',
        layout: 'layouts/admin',
        students: result.docs,
        totalPages: result.totalPages,
        currentPage: result.page,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
        nextPage: result.nextPage,
        prevPage: result.prevPage,
        searchTerm
    });
});

const getAddStudentPage = (req, res) => {
    // Flash se anay wale validation errors aur purana input hasil karein
    const validationErrors = req.flash('validation_errors')[0] || [];
    const oldInput = req.flash('old_input')[0] || {};
    
    // Errors ko ek object mein tabdeel karein taake view mein istemal karna aasan ho
    const errors = {};
    validationErrors.forEach(err => {
        // Use err.path instead of err.param for body validation
        if (!errors[err.path]) {
            errors[err.path] = err.msg;
        }
    });

    res.render('admin/add-student', {
        title: 'Naya Student Shamil Karein',
        layout: 'layouts/admin',
        errors,
        oldInput
    });
};

const postAddStudent = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        req.flash('validation_errors', errors.array());
        req.flash('old_input', req.body);
        return res.redirect('/admin/students/add');
    }

    const { name, rollNumber, class: studentClass, contact, address, birthday } = req.body;
    
    const existingStudent = await Student.findOne({ rollNumber });
    if (existingStudent) {
        req.flash('error_msg', 'Is roll number ka student pehle se mojood hai.');
        req.flash('old_input', req.body);
        return res.redirect('/admin/students/add');
    }

    const newStudentData = { name, rollNumber, class: studentClass, contact, address, birthday };
    if (req.file) {
        // Path ko web-accessible banayein (public folder ko hata kar) aur backslashes ko forward slashes se replace karein
        newStudentData.profileImage = req.file.path.replace('public', '').replace(/\\/g, "/");
    }

    await Student.create(newStudentData);
    
    req.flash('success_msg', 'Student kamyabi se add ho gaya hai.');
    res.redirect('/admin/students');
});

const getEditStudentPage = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);
    if (!student) {
        req.flash('error_msg', 'Student nahi mila.');
        return res.redirect('/admin/students');
    }

    // Flash se anay wale validation errors aur purana input hasil karein
    const validationErrors = req.flash('validation_errors')[0] || [];
    // Agar purana input (ghalat submission ke baad) hai to woh istemal karein, warna database se anay wala data istemal karein
    const oldInput = req.flash('old_input')[0] || student;
    
    const errors = {};
    validationErrors.forEach(err => {
        if (!errors[err.path]) {
            errors[err.path] = err.msg;
        }
    });

    res.render('admin/edit-student', {
        title: 'Student ki Maloomat Tabdeel Karein',
        layout: 'layouts/admin',
        student, // Original student data (e.g., for image preview)
        errors,
        oldInput // Data to populate the form fields
    });
});

const postUpdateStudent = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('validation_errors', errors.array());
        req.flash('old_input', req.body);
        return res.redirect(`/admin/students/edit/${req.params.id}`);
    }

    const student = await Student.findById(req.params.id);
    if (!student) {
        req.flash('error_msg', 'Student nahi mila.');
        return res.redirect('/admin/students');
    }

    const { name, rollNumber, class: studentClass, contact, address, birthday } = req.body;

    // Check if roll number is being changed and if the new one already exists
    if (rollNumber !== student.rollNumber) {
        const existingStudent = await Student.findOne({ rollNumber });
        if (existingStudent) {
            req.flash('error_msg', 'Yeh roll number pehle se kisi aur student ka hai.');
            req.flash('old_input', req.body);
            return res.redirect(`/admin/students/edit/${req.params.id}`);
        }
    }

    student.name = name;
    student.rollNumber = rollNumber;
    student.class = studentClass;
    student.contact = contact;
    student.address = address;
    student.birthday = birthday;

    if (req.file) {
        // Delete old image if it's not the default one
        if (student.profileImage && student.profileImage !== '/images/default-avatar.png') {
            const oldImagePath = path.join(__dirname, '..', 'public', student.profileImage);
            fs.unlink(oldImagePath, (err) => {
                if (err) console.error("Purani image delete karne mein masla:", err);
            });
        }
        student.profileImage = req.file.path.replace('public', '').replace(/\\/g, "/");
    }

    await student.save();
    req.flash('success_msg', 'Student ki maloomat kamyabi se update ho gayi hain.');
    res.redirect('/admin/students');
});

const deleteStudent = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);
    if (student) {
        // Delete profile image from server if it's not the default one
        if (student.profileImage && student.profileImage !== '/images/default-avatar.png') {
            const imagePath = path.join(__dirname, '..', 'public', student.profileImage);
            fs.unlink(imagePath, (err) => {
                if (err) console.error("Image delete karne mein masla:", err);
            });
        }
        await Student.deleteOne({ _id: req.params.id });
        req.flash('success_msg', 'Student kamyabi se delete ho gaya hai.');
    } else {
        req.flash('error_msg', 'Student nahi mila.');
    }
    res.redirect('/admin/students');
});

// TEACHER MANAGEMENT
const getTeachersPage = asyncHandler(async (req, res) => {
    const teachers = await Teacher.find({}).sort({ createdAt: -1 });
    res.render('admin/manage-teachers', {
        title: 'Teachers Manage Karein',
        layout: 'layouts/admin',
        teachers
    });
});

const getAddTeacherPage = (req, res) => {
    const validationErrors = req.flash('validation_errors')[0] || [];
    const oldInput = req.flash('old_input')[0] || {};

    const errors = {};
    validationErrors.forEach(err => {
        if (!errors[err.path]) {
            errors[err.path] = err.msg;
        }
    });

    res.render('admin/add-teacher', {
        title: 'Naya Teacher Shamil Karein',
        layout: 'layouts/admin',
        errors,
        oldInput
    });
};

const postAddTeacher = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('validation_errors', errors.array());
        req.flash('old_input', req.body);
        return res.redirect('/admin/teachers/add');
    }

    const { name, designation, subject, contact } = req.body;
    const newTeacherData = { name, designation, subject, contact };

    if (req.file) {
        newTeacherData.profileImage = req.file.path.replace('public', '').replace(/\\/g, "/");
    }

    await Teacher.create(newTeacherData);
    req.flash('success_msg', 'Teacher kamyabi se add ho gaya hai.');
    res.redirect('/admin/teachers');
});

const getEditTeacherPage = asyncHandler(async (req, res) => {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
        req.flash('error_msg', 'Teacher nahi mila.');
        return res.redirect('/admin/teachers');
    }

    const validationErrors = req.flash('validation_errors')[0] || [];
    const oldInput = req.flash('old_input')[0] || teacher;

    const errors = {};
    validationErrors.forEach(err => {
        if (!errors[err.path]) {
            errors[err.path] = err.msg;
        }
    });

    res.render('admin/edit-teacher', {
        title: 'Teacher ki Maloomat Tabdeel Karein',
        layout: 'layouts/admin',
        teacher,
        errors,
        oldInput
    });
});

const postUpdateTeacher = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('validation_errors', errors.array());
        req.flash('old_input', req.body);
        return res.redirect(`/admin/teachers/edit/${req.params.id}`);
    }

    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
        req.flash('error_msg', 'Teacher nahi mila.');
        return res.redirect('/admin/teachers');
    }

    const { name, designation, subject, contact } = req.body;

    teacher.name = name;
    teacher.designation = designation;
    teacher.subject = subject;
    teacher.contact = contact;

    if (req.file) {
        // Delete old image if it's not the default one
        if (teacher.profileImage && teacher.profileImage !== '/images/default-avatar.png') {
            const oldImagePath = path.join(__dirname, '..', 'public', teacher.profileImage);
            fs.unlink(oldImagePath, (err) => {
                if (err) console.error("Purani image delete karne mein masla:", err);
            });
        }
        teacher.profileImage = req.file.path.replace('public', '').replace(/\\/g, "/");
    }

    await teacher.save();
    req.flash('success_msg', 'Teacher ki maloomat kamyabi se update ho gayi hain.');
    res.redirect('/admin/teachers');
});

const deleteTeacher = asyncHandler(async (req, res) => {
    const teacher = await Teacher.findById(req.params.id);
    if (teacher) {
        // Delete profile image from server if it's not the default one
        if (teacher.profileImage && teacher.profileImage !== '/images/default-avatar.png') {
            const imagePath = path.join(__dirname, '..', 'public', teacher.profileImage);
            fs.unlink(imagePath, (err) => {
                if (err) console.error("Image delete karne mein masla:", err);
            });
        }
        await Teacher.deleteOne({ _id: req.params.id });
        req.flash('success_msg', 'Teacher kamyabi se delete ho gaya hai.');
    } else {
        req.flash('error_msg', 'Teacher nahi mila.');
    }
    res.redirect('/admin/teachers');
});

// ASSIGNMENT MANAGEMENT
const getAssignmentsPage = asyncHandler(async (req, res) => {
    const assignments = await Assignment.find({}).sort({ deadline: 1 }); // Sort by nearest deadline
    res.render('admin/manage-assignments', {
        title: 'Assignments Manage Karein',
        layout: 'layouts/admin',
        assignments,
        lang: getLanguage(req) // For potential future use
    });
});

const getAddAssignmentPage = (req, res) => {
    const validationErrors = req.flash('validation_errors')[0] || [];
    const oldInput = req.flash('old_input')[0] || {};

    const errors = {};
    validationErrors.forEach(err => {
        if (!errors[err.path]) {
            errors[err.path] = err.msg;
        }
    });

    res.render('admin/add-assignment', {
        title: 'Naya Assignment Shamil Karein',
        layout: 'layouts/admin',
        errors,
        oldInput
    });
};

const postAddAssignment = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('validation_errors', errors.array());
        req.flash('old_input', req.body);
        return res.redirect('/admin/assignments/add');
    }

    const { title_en, title_ur, subject, deadline, description_en, description_ur } = req.body;
    const newAssignmentData = {
        title: { en: title_en.trim(), ur: title_ur.trim() },
        subject,
        deadline,
        description: { en: description_en, ur: description_ur },
    };

    if (req.file) {
        newAssignmentData.file = req.file.path.replace('public', '').replace(/\\/g, "/");
    }

    await Assignment.create(newAssignmentData);
    req.flash('success_msg', 'Assignment kamyabi se add ho gaya hai.');
    res.redirect('/admin/assignments');
});

const getEditAssignmentPage = asyncHandler(async (req, res) => {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
        req.flash('error_msg', 'Assignment nahi mila.');
        return res.redirect('/admin/assignments');
    }

    const validationErrors = req.flash('validation_errors')[0] || [];
    const oldInput = req.flash('old_input')[0] || {}; // Pass empty object if no flash data

    const errors = {};
    validationErrors.forEach(err => {
        if (!errors[err.path]) {
            errors[err.path] = err.msg;
        }
    });

    res.render('admin/edit-assignment', {
        title: 'Assignment ki Maloomat Tabdeel Karein',
        layout: 'layouts/admin',
        assignment, // The original db object
        errors,
        oldInput    // The potentially modified data from a failed submission
    });
});

const postUpdateAssignment = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('validation_errors', errors.array());
        req.flash('old_input', req.body);
        return res.redirect(`/admin/assignments/edit/${req.params.id}`);
    }

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
        req.flash('error_msg', 'Assignment nahi mila.');
        return res.redirect('/admin/assignments');
    }

    const { title_en, title_ur, subject, deadline, description_en, description_ur } = req.body;

    assignment.title = { en: title_en.trim(), ur: title_ur.trim() };
    assignment.subject = subject;
    assignment.deadline = deadline;
    assignment.description = { en: description_en, ur: description_ur };

    if (req.file) {
        // Delete the old file if it exists
        if (assignment.file) {
            const oldFilePath = path.join(__dirname, '..', 'public', assignment.file);
            fs.unlink(oldFilePath, (err) => {
                if (err) console.error("Purani assignment file delete karne mein masla:", err);
            });
        }
        assignment.file = req.file.path.replace('public', '').replace(/\\/g, "/");
    }

    await assignment.save();
    req.flash('success_msg', 'Assignment ki maloomat kamyabi se update ho gayi hain.');
    res.redirect('/admin/assignments');
});

const deleteAssignment = asyncHandler(async (req, res) => {
    const assignment = await Assignment.findById(req.params.id);
    if (assignment) {
        // Delete the attachment file if it exists
        if (assignment.file) {
            const filePath = path.join(__dirname, '..', 'public', assignment.file);
            fs.unlink(filePath, (err) => {
                if (err) console.error("Assignment file delete karne mein masla:", err);
            });
        }
        await Assignment.deleteOne({ _id: req.params.id });
        req.flash('success_msg', 'Assignment kamyabi se delete ho gaya hai.');
    } else {
        req.flash('error_msg', 'Assignment nahi mila.');
    }
    res.redirect('/admin/assignments');
});

// NOTES MANAGEMENT
const getNotesPage = asyncHandler(async (req, res) => {
    const subjects = await SubjectNotes.find({}).sort({ 'subject.en': 1 });
    res.render('admin/manage-notes', {
        title: 'Notes Manage Karein',
        layout: 'layouts/admin',
        subjects,
        lang: getLanguage(req)
    });
});

const getAddNoteSubjectPage = (req, res) => {
    const validationErrors = req.flash('validation_errors')[0] || [];
    const oldInput = req.flash('old_input')[0] || {};

    const errors = {};
    validationErrors.forEach(err => {
        if (!errors[err.path]) {
            errors[err.path] = err.msg;
        }
    });

    res.render('admin/add-note-subject', {
        title: 'Naya Subject Shamil Karein',
        layout: 'layouts/admin',
        errors,
        oldInput
    });
};

const postAddNoteSubject = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('validation_errors', errors.array());
        req.flash('old_input', req.body);
        return res.redirect('/admin/notes/add-subject');
    }

    const { subject_en, subject_ur, slug } = req.body;

    const existingSubject = await SubjectNotes.findOne({ slug: slug.toLowerCase() });
    if (existingSubject) {
        req.flash('error_msg', 'This URL slug is already in use. Please choose a different one.');
        req.flash('old_input', req.body);
        return res.redirect('/admin/notes/add-subject');
    }

    await SubjectNotes.create({
        slug,
        subject: { en: subject_en, ur: subject_ur },
        notes: [] // Start with an empty array of notes
    });

    req.flash('success_msg', 'Subject has been created successfully. You can now add notes to it.');
    res.redirect('/admin/notes');
});

const getEditNoteSubjectPage = asyncHandler(async (req, res) => {
    const subject = await SubjectNotes.findOne({ slug: req.params.slug });
    if (!subject) {
        req.flash('error_msg', 'Subject not found.');
        return res.redirect('/admin/notes');
    }

    const validationErrors = req.flash('validation_errors')[0] || [];
    const oldInput = req.flash('old_input')[0] || {};

    const errors = {};
    validationErrors.forEach(err => {
        if (!errors[err.path]) {
            errors[err.path] = err.msg;
        }
    });

    res.render('admin/edit-note-subject', {
        title: 'Manage Subject Notes',
        layout: 'layouts/admin',
        subject,
        errors,
        oldInput,
        lang: getLanguage(req)
    });
});

const postAddNoteToSubject = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const { slug } = req.params;

    if (!errors.isEmpty()) {
        req.flash('validation_errors', errors.array());
        req.flash('old_input', req.body);
        return res.redirect(`/admin/notes/edit/${slug}`);
    }

    const subject = await SubjectNotes.findOne({ slug });
    if (!subject) {
        req.flash('error_msg', 'Subject not found.');
        return res.redirect('/admin/notes');
    }

    const { note_title_en, note_title_ur, note_url } = req.body;
    subject.notes.push({
        title: { en: note_title_en, ur: note_title_ur },
        url: note_url
    });

    await subject.save();
    req.flash('success_msg', 'Note added successfully.');
    res.redirect(`/admin/notes/edit/${slug}`);
});

const deleteNoteFromSubject = asyncHandler(async (req, res) => {
    const { slug, noteId } = req.params;
    
    await SubjectNotes.updateOne(
        { slug: slug },
        { $pull: { notes: { _id: noteId } } }
    );

    req.flash('success_msg', 'Note deleted successfully.');
    res.redirect(`/admin/notes/edit/${slug}`);
});

const deleteSubject = asyncHandler(async (req, res) => {
    const subject = await SubjectNotes.findById(req.params.id);
    if (subject) {
        await SubjectNotes.deleteOne({ _id: req.params.id });
        req.flash('success_msg', 'Subject and all its notes have been deleted.');
    } else {
        req.flash('error_msg', 'Subject not found.');
    }
    res.redirect('/admin/notes');
});

// --- Downloads Management ---
const getDownloadsPage = asyncHandler(async (req, res) => {
    const downloads = await Download.find({}).sort({ createdAt: -1 });
    res.render('admin/manage-downloads', {
        title: 'Downloads Manage Karein',
        layout: 'layouts/admin',
        downloads,
        lang: getLanguage(req)
    });
});

const getAddDownloadPage = (req, res) => {
    const validationErrors = req.flash('validation_errors')[0] || [];
    const oldInput = req.flash('old_input')[0] || {};

    const errors = {};
    validationErrors.forEach(err => {
        if (!errors[err.path]) {
            errors[err.path] = err.msg;
        }
    });

    res.render('admin/add-download', {
        title: 'Naya File Shamil Karein',
        layout: 'layouts/admin',
        errors,
        oldInput
    });
};

const postAddDownload = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() || !req.file) {
        if (!req.file) {
            errors.array().push({ path: 'file', msg: 'File upload karna zaroori hai.' });
        }
        req.flash('validation_errors', errors.array());
        req.flash('old_input', req.body);
        return res.redirect('/admin/downloads/add');
    }

    const { title_en, title_ur, category } = req.body;
    await Download.create({
        title: { en: title_en, ur: title_ur },
        category,
        file: req.file.path.replace('public', '').replace(/\\/g, "/")
    });

    req.flash('success_msg', 'File has been uploaded successfully.');
    res.redirect('/admin/downloads');
});

const getEditDownloadPage = asyncHandler(async (req, res) => {
    const download = await Download.findById(req.params.id);
    if (!download) {
        req.flash('error_msg', 'File not found.');
        return res.redirect('/admin/downloads');
    }
    res.render('admin/edit-download', {
        title: 'File ki Maloomat Tabdeel Karein',
        layout: 'layouts/admin',
        download,
        errors: {},
        oldInput: {}
    });
});

const postUpdateDownload = asyncHandler(async (req, res) => {
    const download = await Download.findById(req.params.id);
    if (!download) {
        req.flash('error_msg', 'File not found.');
        return res.redirect('/admin/downloads');
    }

    const { title_en, title_ur, category } = req.body;
    download.title = { en: title_en, ur: title_ur };
    download.category = category;

    if (req.file) {
        fs.unlink(path.join(__dirname, '..', 'public', download.file), (err) => {
            if (err) console.error("Old download file delete karne mein masla:", err);
        });
        download.file = req.file.path.replace('public', '').replace(/\\/g, "/");
    }

    await download.save();
    req.flash('success_msg', 'File info has been updated successfully.');
    res.redirect('/admin/downloads');
});

const deleteDownload = asyncHandler(async (req, res) => {
    const download = await Download.findByIdAndDelete(req.params.id);
    if (download && download.file) {
        fs.unlink(path.join(__dirname, '..', 'public', download.file), (err) => {
            if (err) console.error("Download file delete karne mein masla:", err);
        });
    }
    req.flash('success_msg', 'File has been deleted successfully.');
    res.redirect('/admin/downloads');
});

// --- Gallery Management ---
const getGalleryPage = asyncHandler(async (req, res) => {
    const images = await Gallery.find({}).sort({ category: 1, createdAt: -1 });

    const groupedImages = images.reduce((acc, image) => {
        const category = image.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(image);
        return acc;
    }, {});

    res.render('admin/manage-gallery', {
        title: 'Gallery Manage Karein',
        layout: 'layouts/admin',
        groupedImages,
        lang: getLanguage(req)
    });
});

const getAddGalleryImagePage = (req, res) => {
    res.render('admin/add-gallery-image', {
        title: 'Nayi Image Shamil Karein',
        layout: 'layouts/admin',
        errors: {},
        oldInput: {}
    });
};

const postAddGalleryImage = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() || !req.file) {
        if (!req.file) {
            errors.array().push({ path: 'image', msg: 'Image upload karna zaroori hai.' });
        }
        req.flash('validation_errors', errors.array());
        req.flash('old_input', req.body);
        return res.redirect('/admin/gallery/add');
    }

    const { title_en, title_ur, category } = req.body;
    await Gallery.create({
        title: { en: title_en, ur: title_ur },
        category,
        image: req.file.path.replace('public', '').replace(/\\/g, "/")
    });

    req.flash('success_msg', 'Image has been uploaded to the gallery successfully.');
    res.redirect('/admin/gallery');
});

const getEditGalleryImagePage = asyncHandler(async (req, res) => {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
        req.flash('error_msg', 'Image not found.');
        return res.redirect('/admin/gallery');
    }
    res.render('admin/edit-gallery-image', {
        title: 'Image ki Maloomat Tabdeel Karein',
        layout: 'layouts/admin',
        image,
        errors: {},
        oldInput: {}
    });
});

const postUpdateGalleryImage = asyncHandler(async (req, res) => {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
        req.flash('error_msg', 'Image not found.');
        return res.redirect('/admin/gallery');
    }

    const { title_en, title_ur, category } = req.body;
    image.title = { en: title_en, ur: title_ur };
    image.category = category;

    if (req.file) {
        fs.unlink(path.join(__dirname, '..', 'public', image.image), (err) => {
            if (err) console.error("Old gallery image delete karne mein masla:", err);
        });
        image.image = req.file.path.replace('public', '').replace(/\\/g, "/");
    }

    await image.save();
    req.flash('success_msg', 'Image info has been updated successfully.');
    res.redirect('/admin/gallery');
});

const deleteGalleryImage = asyncHandler(async (req, res) => {
    const image = await Gallery.findByIdAndDelete(req.params.id);
    if (image && image.image) {
        fs.unlink(path.join(__dirname, '..', 'public', image.image), (err) => {
            if (err) console.error("Gallery image delete karne mein masla:", err);
        });
    }
    req.flash('success_msg', 'Image has been deleted successfully.');
    res.redirect('/admin/gallery');
});

// --- Quiz Management ---
const getQuizPage = (req, res) => {
    res.render('admin/manage-quiz', {
        title: 'Quiz Manage Karein',
        layout: 'layouts/admin'
    });
};

const getEditQuizPage = asyncHandler(async (req, res) => {
    const lang = req.params.lang;
    if (lang !== 'en' && lang !== 'ur') {
        req.flash('error_msg', 'Invalid quiz language.');
        return res.redirect('/admin/quiz');
    }

    let quiz = await Quiz.findOne({ language: lang });

    const validationErrors = req.flash('validation_errors')[0] || [];
    const oldInput = req.flash('old_input')[0] || {};

    const errors = {};
    validationErrors.forEach(err => {
        if (!errors[err.path]) {
            errors[err.path] = err.msg;
        }
    });

    res.render('admin/edit-quiz', {
        title: `Edit ${lang === 'en' ? 'English' : 'Urdu'} Quiz`,
        layout: 'layouts/admin',
        quiz,
        lang,
        errors,
        oldInput
    });
});

const postAddQuizQuestion = asyncHandler(async (req, res) => {
    const lang = req.params.lang;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('validation_errors', errors.array());
        req.flash('old_input', req.body);
        return res.redirect(`/admin/quiz/edit/${lang}`);
    }

    let quiz = await Quiz.findOne({ language: lang });
    if (!quiz) {
        quiz = new Quiz({ language: lang, questions: [] });
    }

    const { question, option1, option2, option3, option4, answer } = req.body;
    quiz.questions.push({
        question,
        options: [option1, option2, option3, option4],
        answer
    });

    await quiz.save();
    req.flash('success_msg', 'Question added successfully.');
    res.redirect(`/admin/quiz/edit/${lang}`);
});

const deleteQuizQuestion = asyncHandler(async (req, res) => {
    const { lang, questionId } = req.params;
    await Quiz.updateOne({ language: lang }, { $pull: { questions: { _id: questionId } } });
    req.flash('success_msg', 'Question deleted successfully.');
    res.redirect(`/admin/quiz/edit/${lang}`);
});

// --- Feedback Management ---
const getFeedbackPage = asyncHandler(async (req, res) => {
    const feedback = await Feedback.find({}).sort({ createdAt: -1 });
    res.render('admin/manage-feedback', {
        title: 'User Feedback',
        layout: 'layouts/admin',
        feedback
    });
});

const deleteFeedback = asyncHandler(async (req, res) => {
    await Feedback.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Feedback has been deleted successfully.');
    res.redirect('/admin/feedback');
});

const postBulkUploadQuiz = asyncHandler(async (req, res) => {
    const lang = req.params.lang;

    if (!req.file) {
        req.flash('error_msg', 'Please upload a valid CSV file.');
        return res.redirect(`/admin/quiz/edit/${lang}`);
    }

    const questions = [];
    const filePath = req.file.path;

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            // Basic validation for each row
            if (row.question && row.option1 && row.option2 && row.option3 && row.option4 && row.answer) {
                questions.push({
                    question: row.question,
                    options: [row.option1, row.option2, row.option3, row.option4],
                    answer: row.answer
                });
            }
        })
        .on('end', async () => {
            // Delete the temporary file from the server
            fs.unlinkSync(filePath);

            if (questions.length > 0) {
                await Quiz.updateOne(
                    { language: lang },
                    { $push: { questions: { $each: questions } } },
                    { upsert: true } // If quiz for the language doesn't exist, create it
                );
                req.flash('success_msg', `${questions.length} questions were successfully uploaded and added.`);
            } else {
                req.flash('error_msg', 'The uploaded file was empty or had an incorrect format.');
            }
            res.redirect(`/admin/quiz/edit/${lang}`);
        });
});

// Exports
module.exports = {
    getAdminDashboard, getChangePasswordPage, postChangePassword,
    getStudentsPage, getAddStudentPage, postAddStudent, getEditStudentPage, postUpdateStudent, deleteStudent,
    getTeachersPage, getAddTeacherPage, postAddTeacher, getEditTeacherPage, postUpdateTeacher, deleteTeacher,
    getAssignmentsPage, getAddAssignmentPage, postAddAssignment, getEditAssignmentPage, postUpdateAssignment, deleteAssignment,
    getNotesPage, getAddNoteSubjectPage, postAddNoteSubject, getEditNoteSubjectPage, postAddNoteToSubject, deleteNoteFromSubject, deleteSubject,
    getDownloadsPage, getAddDownloadPage, postAddDownload, getEditDownloadPage, postUpdateDownload, deleteDownload,
    getGalleryPage, getAddGalleryImagePage, postAddGalleryImage, getEditGalleryImagePage, postUpdateGalleryImage, deleteGalleryImage,
    getQuizPage, getEditQuizPage, postAddQuizQuestion, deleteQuizQuestion,
    getFeedbackPage, deleteFeedback
};
