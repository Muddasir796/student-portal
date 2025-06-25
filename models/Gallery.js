// models/Gallery.js

const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    caption: {
        en: { type: String, required: true },
        ur: { type: String, required: true }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;
