import express from 'express';
import { getChatResponse } from '../services/chatService';
import { Ticket } from '../models/Ticket';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

router.post('/', async (req: AuthRequest, res) => {
  try {
    const { message, ticketId } = req.body;
    const userId = req.user?._id;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // If ticketId is provided, fetch the ticket data
    let ticketData = null;
    if (ticketId) {
      const ticket = await Ticket.findOne({ 
        _id: ticketId,
        $or: [
          { createdBy: userId },
          { assignedTo: userId }
        ]
      });

      if (ticket) {
        ticketData = {
          ticketNumber: ticket.ticketNumber,
          subject: ticket.subject,
          description: ticket.description,
          status: ticket.status,
          department: ticket.department,
          priority: ticket.priority,
          createdAt: ticket.createdAt
        };
      }
    }

    // Get response from chat service with ticket data
    const response = await getChatResponse(message, ticketData);

    res.json({
      message: response.message,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
});

export default router; 