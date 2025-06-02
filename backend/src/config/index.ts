import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/helpdesk',
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  nodeEnv: process.env.NODE_ENV || 'development'
}; 