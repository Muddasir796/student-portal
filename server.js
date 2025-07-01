// server.js (Final version with Render Port Fix)

const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo'); // Session store ke liye
const session = require('express-session');
const cookieParser = require('cookie-parser'); // CSRF ke liye zaroori
const csrf = require('tiny-csrf'); // CSRF protection ke liye
const flash = require('connect-flash'); // Flash messages ke liye
const helmet = require('helmet'); // Security ke liye
const morgan = require('morgan'); // Request logging ke liye
require('dotenv').config();

// --- Custom Middleware Import ---
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

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

// --- Core Middleware ---
// Security Headers
app.use(helmet());

// Development mein request logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET || 'default-cookie-secret')); // Cookie secret .env se lein

app.use(session({
    secret: process.env.SESSION_SECRET, // .env se secret istemal karein
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // Production mein secure cookies
        httpOnly: true, // Cross-site scripting (XSS) se bachao
        maxAge: 1000 * 60 * 60 * 24 
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions' // Database mein sessions collection ka naam
    })
}));

// --- CSRF Protection Middleware ---
// Yeh hamesha session aur urlencoded ke baad aana chahiye.
app.use(csrf({
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', // Sab se mehfooz option
        httpOnly: true,
    }
}));

// --- Flash Message Middleware ---
app.use(flash()); // Flash ko initialize karein

// Custom middleware taake flash messages aur CSRF token tamam views mein available hon
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    // CSRF token ko locals mein daalein taake har form mein istemal ho sake
    if (req.csrfToken) {
        res.locals.csrfToken = req.csrfToken();
    }
    next();
});

// --- View Engine Setup ---
app.use(ejsLayouts);
app.set('view engine', 'ejs');


// --- Application Routes ---
app.use('/api', apiRoutes); 
app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/', pageRoutes);

// --- Error Handling Middleware ---
// Yeh hamesha routes ke baad anay chahiye
app.use(notFoundHandler); // 404 errors ke liye
app.use(errorHandler); // Tamam doosre errors ke liye


// --- Server Start ---
app.listen(PORT, () => {
  console.log(`Server ab ${PORT} port par chal raha hai. Environment: ${process.env.NODE_ENV || 'development'}`);
});
