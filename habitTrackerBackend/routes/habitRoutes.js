import express from 'express';
import { createHabit, getHabits, checkHabit, reactToHabit, deleteHabit } from '../controllers/habitController.js';
import protect from '../middleware/authMiddleware.js'; // Import authentication middleware

const router = express.Router();

// protected POST: create habit
router.post('/', protect, createHabit); 

// protected GET: get all habits for a user
router.get('/', protect, getHabits); 

// protected PATCH: mark habit as done for the day
router.patch('/:id/check', protect, checkHabit);

// protected PATCH: react to habit after checked
router.patch('/:id/react', protect, reactToHabit);

// protected DELETE: delete habit
router.delete('/:id', protect, deleteHabit);

export default router;