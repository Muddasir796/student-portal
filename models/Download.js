// models/Download.js

const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema({
    title: {
        en: { type: String, required: true, trim: true },
        ur: { type: String, required: true, trim: true }
    },
    file: {
        type: String,
        required: [true, 'File upload karna zaroori hai']
    },
    category: {
        type: String,
        default: 'General',
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Download', downloadSchema);