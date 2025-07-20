import express from 'express';
import { getUserCategorySummary } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js'; // Import authentication middleware

const router = express.Router();

// protected GET: get user category summary
router.get('/category-summary', protect, getUserCategorySummary);

export default router;

