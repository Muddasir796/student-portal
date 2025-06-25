// server.js (Final version with complete Admin Section routing)

const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
require('dotenv').config();

// --- Routes Import ---
const apiRoutes = require('./routes/apiRoutes.js'); 
const pageRoutes = require('./routes/pageRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js'); // Naya Admin route

const app = express();
const PORT = 3000;

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Database se connection kamyab ho gaya!'))
    .catch(err => console.error('Database connection mein masla hai:', err));

// --- Middleware ---
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'a-very-secret-key-for-my-portal',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use(ejsLayouts);
app.set('view engine', 'ejs');


// --- Routes Usage ---
app.use('/api', apiRoutes); 
app.use('/', authRoutes);

// Nayi Line: Server ko batayein ke '/admin' se shuru honay wale tamam routes
// ko handle karne ki zimadari 'adminRoutes' ki hai.
app.use('/admin', adminRoutes);

// Public page routes ko aakhir mein rakhein
app.use('/', pageRoutes);


// --- Server Start ---
app.listen(PORT, () => {
  console.log(`Server kamyabi se http://localhost:${PORT} par chal raha hai`);
});
