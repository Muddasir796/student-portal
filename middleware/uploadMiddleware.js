// middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Yeh function ek "factory" hai jo alag-alag uploader banata hai
const createUploader = (subfolder, allowedTypes = /jpeg|jpg|png|gif/) => {
    // Files ko kahan save karna hai, iski configuration
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const dest = `public/uploads/${subfolder}/`;
            // Yakeeni banayein ke directory maujood hai, agar nahi to banayein
            fs.mkdirSync(dest, { recursive: true });
            cb(null, dest);
        },
        filename: function (req, file, cb) {
            // File ka naam unique banayein taake koi file overwrite na ho
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        }
    });

    // File type ko check karne wala filter
    const fileFilter = (req, file, cb) => {
        const mimetype = allowedTypes.test(file.mimetype);
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error(`Error: Sirf in file types ki ijazat hai: ${allowedTypes.toString()}`));
    };

    return multer({
        storage: storage,
        fileFilter: fileFilter,
        limits: { fileSize: 1024 * 1024 * 10 } // 10MB file size limit
    });
};

module.exports = createUploader;