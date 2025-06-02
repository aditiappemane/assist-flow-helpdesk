import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { config } from './config';
import authRoutes from './routes/auth';
import ticketRoutes from './routes/tickets';
import chatRouter from './routes/chat';

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Enable pre-flight requests for all routes
app.options('*', cors());

app.use(express.json());
app.use(cookieParser());

// Database connection with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/chat', chatRouter);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Helpdesk API' });
});

// Health check
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'ok',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    res.status(400).json({ 
      error: 'Validation Error',
      details: err.message 
    });
    return;
  }
  
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ 
      error: 'Unauthorized',
      details: err.message 
    });
    return;
  }

  // Default error
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
}); 