// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/user.js';                          // Import User model

const protect = async (req, res, next) => {
    let token;

    // Check if token is in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user by ID from token
            req.user = await User.findById(decoded.id).select('-passwordHash'); // Exclude passwordHash

            next();                                                             // Proceed to the next middleware or route handler
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
}
export default protect; // Export the middleware for use in routes
