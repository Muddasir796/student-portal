// middleware/authMiddleware.js

const isLoggedIn = (req, res, next) => {
    // Check karein ke kya user ka session maujood hai
    if (!req.session.userId) {
        // Agar session nahi hai, to user ko ek error message ke saath login page par bhej dein.
        req.flash('error_msg', 'Is page ko dekhne ke liye login karna zaroori hai.');
        return res.redirect('/login');
    }
    // Agar session hai, to user login hai.
    // 'next()' ka matlab hai "agle qadam par jao" (yaani controller chalao).
    next();
};

const isAdmin = (req, res, next) => {
    // Pehle check karo ke login hai ya nahi
    if (!req.session.userId) {
        req.flash('error_msg', 'Is page ko dekhne ke liye login karna zaroori hai.');
        return res.redirect('/login');
    }

    // Ab check karo ke kya user ka role 'admin' hai
    if (req.session.role !== 'admin') {
        // Agar role admin nahi hai, to usey ijazat nahi hai. Usey home page par bhej dein.
        req.flash('error_msg', 'Aap ke paas is page ko dekhne ki ijazat nahi hai.');
        return res.redirect('/');
    }
    
    // Agar user login bhi hai aur admin bhi hai, to aage jane do.
    next();
};


module.exports = {
    isLoggedIn,
    isAdmin
};
