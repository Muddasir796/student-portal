// models/Download.js

const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema({
    title: {
        en: { type: String, required: true },
        ur: { type: String, required: true }
    },
    description: {
        en: { type: String, required: true },
        ur: { type: String, required: true }
    },
    url: {
        type: String,
        required: true,
        default: '#'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Download = mongoose.model('Download', downloadSchema);

module.exports = Download;
