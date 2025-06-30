// utils/asyncHandler.js

/**
 * Yeh ek higher-order function hai jo async controller functions ko wrap karta hai.
 * Yeh khud-ba-khud errors ko catch kar ke Express ke error handling middleware ko bhej deta hai.
 * Is se humein har controller mein try...catch block likhne ki zaroorat nahi rehti.
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;