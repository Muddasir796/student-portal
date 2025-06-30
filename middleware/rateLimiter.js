// middleware/rateLimiter.js

const rateLimit = require('express-rate-limit');

// Login attempts ko limit karne ke liye
const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minute ka window
	max: 10, // Har IP se 15 minute mein 10 koshishein
	message: 'Login karne ki bohat zyada koshishein ki gayi hain. Baraye meharbani 15 minute baad dobara try karein.',
	standardHeaders: true, // Rate limit ki info 'RateLimit-*' headers mein bhejein
	legacyHeaders: false, // 'X-RateLimit-*' headers ko disable karein
});

module.exports = {
	loginLimiter,
};