import mongoose from 'mongoose';
import { User } from '../models/User';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const createTestUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/helpdesk');
    console.log('Connected to MongoDB');

    // Create test users
    const testUsers = [
      {
        email: 'admin@test.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin' as const,
      },
      {
        email: 'it.agent@test.com',
        password: 'agent123',
        name: 'IT Support Agent',
        role: 'agent' as const,
        department: 'IT',
      },
      {
        email: 'hr.agent@test.com',
        password: 'agent123',
        name: 'HR Support Agent',
        role: 'agent' as const,
        department: 'HR',
      },
      {
        email: 'admin.agent@test.com',
        password: 'agent123',
        name: 'Admin Support Agent',
        role: 'agent' as const,
        department: 'Admin',
      },
      {
        email: 'user@test.com',
        password: 'user123',
        name: 'Regular User',
        role: 'user' as const,
      },
    ];

    // Create users
    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`User ${userData.email} already exists`);
        continue;
      }

      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${userData.email}`);
    }

    console.log('Test users created successfully');
  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
createTestUser(); 