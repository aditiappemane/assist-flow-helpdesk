import { Request, Response, RequestHandler } from 'express';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

// Get all users (admin only)
export const getUsers: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find({}, '-password')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
};

// Create a new user (admin only)
export const createUser: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password, name, role, department } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      res.status(400).json({ error: 'Email, password, and name are required' });
      return;
    }

    // Validate password length
    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long' });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
      role: role || 'user',
      department,
    });

    await user.save();

    // Return user without password
    const { password: _, ...userResponse } = user.toObject();
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ error: 'Error creating user' });
  }
};

// Update a user (admin only)
export const updateUser: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, role, department, email } = req.body;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Update user fields
    if (name) user.name = name;
    if (role) user.role = role;
    if (department) user.department = department;
    if (email) user.email = email;

    await user.save();

    // Return updated user without password
    const { password: _, ...userResponse } = user.toObject();
    res.json(userResponse);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(400).json({ error: 'Error updating user' });
  }
};

// Delete a user (admin only)
export const deleteUser: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(400).json({ error: 'Error deleting user' });
  }
};

// Get user stats
export const getUserStats: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const agents = await User.countDocuments({ role: 'agent' });
    const employees = await User.countDocuments({ role: 'user' });
    const admins = await User.countDocuments({ role: 'admin' });

    res.json({
      totalUsers,
      agents,
      employees,
      admins
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Error fetching user stats' });
  }
}; 