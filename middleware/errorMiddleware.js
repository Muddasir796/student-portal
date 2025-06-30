// middleware/errorMiddleware.js

const errorHandler = (err, req, res, next) => {
    // Agar error mein pehle se status code hai to woh istemal karein, warna 500 (Internal Server Error)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // Production environment mein user ko technical details na dikhayein
    const isProduction = process.env.NODE_ENV === 'production';

    res.status(statusCode);

    // Error ko console par log karein (development mein zaroori)
    console.error({
        title: 'ERROR LOG',
        message: err.message,
        stack: isProduction ? '🥞' : err.stack, // Production mein stack trace chupayein
    });

    // User ko ek error page render karein
    res.render('error', {
        title: 'Kuch Garbar Ho Gayi!',
        message: isProduction ? 'Server par ek an-dekha masla paish aya hai. Hum jald hi isay theek kar dein gey.' : err.message,
        statusCode: statusCode,
        layout: 'layouts/main' // Main layout istemal karein
    });
};

const notFoundHandler = (req, res, next) => {
    const error = new Error(`Page Nahi Mila - ${req.originalUrl}`);
    res.status(404);
    next(error); // Error ko aagey error handler ko bhej dein
};

module.exports = { errorHandler, notFoundHandler };