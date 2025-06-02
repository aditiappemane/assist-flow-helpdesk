import { Request, Response, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config';

export const register: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, role, department } = req.body;

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

    // Generate token
    const token = jwt.sign({ _id: user._id }, config.jwtSecret, {
      expiresIn: '7d',
    });

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: 'Error creating user' });
  }
};

export const login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    console.log('User found:', { id: user._id, role: user.role });

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Invalid password for user:', email);
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    console.log('Password verified for user:', email);

    // Generate token
    const token = jwt.sign({ _id: user._id }, config.jwtSecret, {
      expiresIn: '7d',
    });
    console.log('Token generated for user:', email);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
}; 