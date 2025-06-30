// middleware/adminValidationMiddleware.js
const { body } = require('express-validator');

const studentValidationRules = () => {
    return [
        body('name', 'Student ka naam likhna zaroori hai.')
            .trim()
            .notEmpty()
            .escape(), // Cross-Site Scripting (XSS) se bachao

        body('rollNumber', 'Roll number likhna zaroori hai.')
            .trim()
            .notEmpty()
            .isNumeric().withMessage('Roll number sirf adad (numbers) mein hona chahiye.'),

        body('class', 'Class likhna zaroori hai.')
            .trim()
            .notEmpty()
            .escape(),

        body('contact', 'Contact number ka format ghalat hai.')
            .optional({ checkFalsy: true }) // Yeh field optional hai, lekin agar di jaye to validate ho
            .trim()
            .isMobilePhone('any', { strictMode: false }), // Kisi bhi region ka phone number ho sakta hai

        body('address', 'Address likhna zaroori hai.')
            .trim()
            .notEmpty()
            .escape(),
    ];
};

const teacherValidationRules = () => {
    return [
        body('name', 'Teacher ka naam likhna zaroori hai.')
            .trim()
            .notEmpty()
            .escape(),

        body('designation', 'Ohda (Designation) likhna zaroori hai.')
            .trim()
            .notEmpty()
            .escape(),

        body('subject', 'Mazmoon (Subject) likhna zaroori hai.')
            .trim()
            .notEmpty()
            .escape(),

        body('contact', 'Contact number ka format ghalat hai.')
            .optional({ checkFalsy: true })
            .trim()
            .isMobilePhone('any', { strictMode: false }),
    ];
};

const assignmentValidationRules = () => {
    return [
        body('title_en', 'English title is required.').trim().notEmpty().escape(),
        body('title_ur', 'Urdu title is required.').trim().notEmpty().escape(),
        
        body('subject', 'Subject is required.').trim().notEmpty().escape(),

        body('deadline', 'A valid deadline date is required.')
            .notEmpty()
            .isISO8601() // Ensures it's a valid date format (YYYY-MM-DD)
            .toDate(), // Converts the string to a JavaScript Date object

        body('description_en', 'English description is required.')
            .trim()
            .notEmpty()
            .escape(),

        body('description_ur', 'Urdu description is required.')
            .trim()
            .notEmpty()
            .escape(),

        body('birthday')
            .optional({ checkFalsy: true })
            .isISO8601().withMessage('Please enter a valid date.')
            .toDate(),
    ];
};

const noteSubjectValidationRules = () => {
    return [
        body('subject_en', 'English subject name is required.')
            .trim()
            .notEmpty()
            .escape(),

        body('subject_ur', 'Urdu subject name is required.')
            .trim()
            .notEmpty()
            .escape(),

        body('slug', 'A valid, unique URL slug is required.')
            .trim()
            .notEmpty()
            .isSlug().withMessage('Slug can only contain lowercase letters, numbers, and hyphens.')
            .escape(),
    ];
};

const noteValidationRules = () => {
    return [
        body('note_title_en', 'English note title is required.').trim().notEmpty().escape(),
        body('note_title_ur', 'Urdu note title is required.').trim().notEmpty().escape(),
        body('note_url', 'A valid URL for the note is required.')
            .trim()
            .notEmpty()
            .isURL()
            .withMessage('Please enter a valid URL (e.g., https://example.com/note.pdf)'),
    ];
};

const changePasswordValidationRules = () => {
    return [
        body('currentPassword', 'Current password is required.').notEmpty(),
        body('newPassword', 'New password must be at least 6 characters long.').isLength({ min: 6 }),
        body('confirmPassword', 'Password confirmation is required.')
            .notEmpty()
            .custom((value, { req }) => {
                if (value !== req.body.newPassword) {
                    throw new Error('New password and confirmation do not match.');
                }
                return true;
            }),
    ];
};

const downloadValidationRules = () => {
    return [
        body('title_en', 'English title is required.').trim().notEmpty().escape(),
        body('title_ur', 'Urdu title is required.').trim().notEmpty().escape(),
        body('category', 'Category is required.').trim().notEmpty().escape(),
    ];
};

const galleryValidationRules = () => {
    return [
        body('title_en', 'English title is required.').trim().notEmpty().escape(),
        body('title_ur', 'Urdu title is required.').trim().notEmpty().escape(),
        body('category', 'Category is required.').trim().notEmpty().escape(),
    ];
};

const quizQuestionValidationRules = () => {
    return [
        body('question', 'Question text is required.').trim().notEmpty().escape(),
        body('option1', 'Option 1 is required.').trim().notEmpty().escape(),
        body('option2', 'Option 2 is required.').trim().notEmpty().escape(),
        body('option3', 'Option 3 is required.').trim().notEmpty().escape(),
        body('option4', 'Option 4 is required.').trim().notEmpty().escape(),
        body('answer', 'Correct answer is required.')
            .trim()
            .notEmpty()
            .escape(),
    ];
};

module.exports = {
    studentValidationRules,
    teacherValidationRules,
    assignmentValidationRules,
    noteSubjectValidationRules,
    noteValidationRules,
    changePasswordValidationRules,
    downloadValidationRules,
    galleryValidationRules,
    quizQuestionValidationRules,
};