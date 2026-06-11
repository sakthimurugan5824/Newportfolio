const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('Authorization');

    // Check if no token
    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    try {
        const tokenString = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
        const decoded = jwt.verify(tokenString, process.env.JWT_SECRET || 'fallback_secret');
        req.admin = decoded.admin;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};
