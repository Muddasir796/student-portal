// server.js (Final version with Render Port Fix)

const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
require('dotenv').config();

// --- Routes Import ---
const apiRoutes = require('./routes/apiRoutes.js'); 
const pageRoutes = require('./routes/pageRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');

const app = express();
// FIX: Render se anay wala port istemal karein, ya agar local hai to 3000.
const PORT = process.env.PORT || 3000;

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Database se connection kamyab ho gaya!'))
    .catch(err => console.error('Database connection mein masla hai:', err));

// --- Middleware ---
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET, // .env se secret istemal karein
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use(ejsLayouts);
app.set('view engine', 'ejs');


// --- Routes Usage ---
app.use('/api', apiRoutes); 
app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/', pageRoutes);


// --- Server Start ---
app.listen(PORT, () => {
  console.log(`Server ab ${PORT} port par chal raha hai`);
});
