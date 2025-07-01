// server.js (Final version with all fixes including trust proxy)

const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const csrf = require('tiny-csrf');
const flash = require('connect-flash');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// --- Custom Middleware Import ---
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

// --- Routes Import ---
const apiRoutes = require('./routes/apiRoutes.js'); 
const pageRoutes = require('./routes/pageRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');

const app = express();
const PORT = process.env.PORT || 3000;

// --- YEH NAINA FIX ADD KIYA GAYA HAI ---
// Render ke proxy par bharosa karne ke liye yeh line zaroori hai
app.set('trust proxy', 1); 

// --- Secret Key ---
const COOKIE_AND_CSRF_SECRET = 'abf8e7d6c5b4a39281706f5e4d3c2b1a';

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Database se connection kamyab ho gaya!'))
    .catch(err => console.error('Database connection mein masla hai:', err));

// --- Core Middleware ---
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Middleware (Correct Order) ---
app.use(cookieParser(COOKIE_AND_CSRF_SECRET)); 
app.use(session({
    secret: COOKIE_AND_CSRF_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions'
    })
}));
app.use(flash());
app.use(csrf(
    COOKIE_AND_CSRF_SECRET, 
    ['POST'],
    []
));

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
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
app.use(notFoundHandler);
app.use(errorHandler);

// --- Server Start ---
app.listen(PORT, () => {
  console.log(`Server ab ${PORT} port par chal raha hai. Environment: ${process.env.NODE_ENV || 'development'}`);
});
