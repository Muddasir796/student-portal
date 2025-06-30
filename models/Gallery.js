// models/Gallery.js

const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    title: {
        en: { type: String, required: true, trim: true },
        ur: { type: String, required: true, trim: true }
    },
    image: {
        type: String,
        required: [true, 'Image upload karna zaroori hai']
    },
    category: {
        type: String,
        default: 'General Events',
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Gallery', gallerySchema);