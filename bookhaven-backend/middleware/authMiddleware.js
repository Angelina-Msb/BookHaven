const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Get token from header (Format: "Bearer <token>")
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        // Verify token using secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Contains userId stored in token payload
        next(); // Pass control to the next handler/route
    } catch (err) {
        res.status(401).json({ message: 'Token is invalid or expired' });
    }
};

module.exports = authMiddleware;