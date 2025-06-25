// middleware/authMiddleware.js

const isLoggedIn = (req, res, next) => {
    // Check karein ke kya user ka session maujood hai
    if (!req.session.userId) {
        // Agar session nahi hai, to user login nahi hai.
        // Usey login page par wapas bhej dein.
        return res.redirect('/login');
    }
    // Agar session hai, to user login hai.
    // 'next()' ka matlab hai "agle qadam par jao" (yaani controller chalao).
    next();
};

const isAdmin = (req, res, next) => {
    // Pehle check karo ke login hai ya nahi
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    // Ab check karo ke kya user ka role 'admin' hai
    if (req.session.role !== 'admin') {
        // Agar role admin nahi hai, to usey ijazat nahi hai.
        // Hum usey ek error page par bhej sakte hain ya home page par.
        return res.status(403).send("You do not have permission to view this page.");
    }
    
    // Agar user login bhi hai aur admin bhi hai, to aage jane do.
    next();
};


module.exports = {
    isLoggedIn,
    isAdmin
};
