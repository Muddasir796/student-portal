// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Password ko hash karne ke liye

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Har admin ka username alag hoga
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8 // Kam se kam 8 huroof ka password
    },
    role: {
        type: String,
        enum: ['admin', 'teacher'], // Mustaqbil mein hum 'teacher' role bhi shamil kar sakte hain
        default: 'admin'
    }
});

// --- Password Hashing (Sab se Zaroori Hissa) ---
// Yeh function naya user save hone se pehle har baar chalega
userSchema.pre('save', async function(next) {
    // Agar password tabdeel nahi hua, to kuch na karo
    if (!this.isModified('password')) {
        return next();
    }
    
    // Password ko hash karo
    const salt = await bcrypt.genSalt(10); // Hashing ki complexity
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
