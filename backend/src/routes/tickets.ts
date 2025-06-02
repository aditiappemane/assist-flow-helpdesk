import express from 'express';
import {
  createTicket,
  getUserTickets,
  getTicket,
  updateTicket,
  updateTicketStatus,
  addComment,
  assignTicket,
  getTickets,
  getTicketStats,
  getDepartmentTickets
} from '../controllers/ticketController';
import { auth, checkRole } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Create ticket (any authenticated user)
router.post('/', createTicket);

// Get all tickets (admin only)
router.get('/all', checkRole(['admin']), getTickets);

// Get department tickets (agents only)
router.get('/department', checkRole(['agent']), getDepartmentTickets as express.RequestHandler);

// Get all tickets for the authenticated user
router.get('/my-tickets', getUserTickets);

// Get single ticket
router.get('/:id', getTicket);

// Update ticket
router.patch('/:id', updateTicket);

// Add comment to ticket
router.post('/:id/comments', addComment);

// Assign ticket (admin only)
router.post('/:id/assign', checkRole(['admin']), assignTicket);

// Update ticket status
router.patch('/:id/status', updateTicketStatus);

// Get ticket statistics
router.get('/stats', getTicketStats);

export default router; 