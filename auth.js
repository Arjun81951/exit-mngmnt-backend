// ...existing code...

exports.validateAccessToken = function (token) {
    if (!token) {
        return { valid: false, message: "Token is missing" };
    }
    try {
        // Replace 'yourSecretKey' with your actual secret key
        const decoded = require('jsonwebtoken').verify(token, 'yourSecretKey');
        return { valid: true, decoded };
    } catch (err) {
        return { valid: false, message: "Invalid token" };
    }
};
