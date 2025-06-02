import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User, IUser } from '../models/User';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    role: string;
    department?: string;
  };
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { _id: string };
    const user = await User.findById(decoded._id).lean();

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    // Ensure we have a valid user object with required fields
    if (!user._id || !user.role) {
      res.status(401).json({ message: 'Invalid user data' });
      return;
    }

    req.user = {
      _id: user._id.toString(),
      role: user.role,
      department: user.department
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const checkRole = (roles: string[]): RequestHandler => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Please authenticate.' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Access denied.' });
      return;
    }

    next();
  };
}; 