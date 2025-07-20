// routes/authRoutes.js
import express from 'express';
import  {registerUser, loginUser, verifyToken} from '../controllers/authController.js'; // import auth controller functions
import protect from '../middleware/authMiddleware.js';                     // import auth middleware for protected routes

const router = express.Router();                                          // create a new router instance

// POST /api/auth/register -> Calls registerUser controller
router.post('/register', registerUser);

// POST /api/auth/login -> Calls loginUser controller
router.post('/login', loginUser);

// GET /api/auth/verify -> Calls verifyToken controller
router.get('/verify', protect, verifyToken);

// Example of a protected route (uncomment to use)
 router.get('/protected', protect, (req, res) => {
     res.status(200).json({ message: 'This is a protected route', user: req.user });
 });

export default router;                                                   // export for use in index.js