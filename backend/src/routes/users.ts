import express from 'express';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} from '../controllers/userController';
import { auth, checkRole } from '../middleware/auth';

const router = express.Router();

// All routes require authentication and admin role
router.use(auth);
router.use(checkRole(['admin']));

// Get all users
router.get('/', getUsers);

// Get user stats
router.get('/stats', getUserStats);

// Create a new user
router.post('/', createUser);

// Update a user
router.put('/:id', updateUser);

// Delete a user
router.delete('/:id', deleteUser);

export default router; 