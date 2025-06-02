import { Request, Response, RequestHandler, NextFunction } from 'express';
import { Ticket, ITicket } from '../models/Ticket';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import mongoose from 'mongoose';

// Create a new ticket
export const createTicket: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { subject, description, priority, department } = req.body;
    const createdBy = req.user?._id;

    if (!createdBy) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Validate required fields
    if (!subject || !description || !department) {
      res.status(400).json({ error: 'Subject, description, and department are required' });
      return;
    }

    // Validate department
    const validDepartments = ['IT', 'HR', 'Admin'];
    if (!validDepartments.includes(department)) {
      res.status(400).json({ error: 'Invalid department. Must be one of: IT, HR, Admin' });
      return;
    }

    // Generate ticket number
    const lastTicket = await Ticket.findOne().sort({ createdAt: -1 });
    let ticketNumber;
    
    if (lastTicket && lastTicket.ticketNumber) {
      const lastNumber = parseInt(lastTicket.ticketNumber.replace('TK-', ''));
      ticketNumber = `TK-${String(lastNumber + 1).padStart(3, '0')}`;
    } else {
      ticketNumber = 'TK-001';
    }

    const ticket = new Ticket({
      ticketNumber,
      subject,
      description,
      priority: priority || 'medium',
      department,
      createdBy,
      status: 'open',
      comments: []
    });

    await ticket.save();

    res.status(201).json({
      message: 'Ticket created successfully',
      ticket,
    });
  } catch (error: any) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: error.message || 'Error creating ticket' });
  }
};

// Get all tickets (filtered by user role)
export const getTickets: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    let query = {};
    
    // If user is not admin, only show their tickets
    if (user.role !== 'admin') {
      query = { createdBy: user._id };
    }

    const tickets = await Ticket.find(query)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    res.json(tickets);
  } catch (error: any) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: error.message || 'Error fetching tickets' });
  }
};

// Get all tickets for a user
export const getUserTickets: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const tickets = await Ticket.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    res.json(tickets);
  } catch (error: any) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: error.message || 'Error fetching tickets' });
  }
};

// Get a single ticket
export const getTicket: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ticketNumber = req.params.id;
    
    if (!ticketNumber) {
      res.status(400).json({ error: 'Ticket number is required' });
      return;
    }

    const ticket = await Ticket.findOne({ ticketNumber })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!ticket) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }

    // Check if user has permission to view this ticket
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Allow access if user is admin, created the ticket, or is an agent in the same department
    const canAccess = 
      user.role === 'admin' || 
      (ticket.createdBy && ticket.createdBy._id.toString() === user._id) ||
      (user.role === 'agent' && user.department === ticket.department);

    if (!canAccess) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(ticket);
  } catch (error: any) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ error: error.message || 'Error fetching ticket' });
  }
};

// Update ticket status
export const updateTicketStatus: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }

    ticket.status = status;
    await ticket.save();

    res.json({
      message: 'Ticket status updated successfully',
      ticket,
    });
  } catch (error: any) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ error: error.message || 'Error updating ticket' });
  }
};

// Update ticket
export const updateTicket: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }

    // Check if user has permission to update ticket
    if (
      req.user?.role !== 'admin' &&
      ticket.createdBy.toString() !== req.user?._id.toString()
    ) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'status', 'priority', 'category'] as const;
    type AllowedUpdate = typeof allowedUpdates[number];

    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update as AllowedUpdate)
    );

    if (!isValidOperation) {
      res.status(400).json({ error: 'Invalid updates' });
      return;
    }

    // Type-safe update
    updates.forEach((update) => {
      const key = update as AllowedUpdate;
      if (key in ticket) {
        (ticket as any)[key] = req.body[key];
      }
    });

    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(400).json({ error: 'Error updating ticket' });
  }
};

// Add comment to ticket
export const addComment: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }

    if (!req.user?._id) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    ticket.comments.push({
      text: req.body.text,
      user: new mongoose.Types.ObjectId(req.user._id),
      createdAt: new Date()
    });

    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(400).json({ error: 'Error adding comment' });
  }
};

// Assign ticket
export const assignTicket: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { agentId } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }

    // Only admin can assign tickets
    if (req.user?.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const agent = await User.findOne({ _id: agentId, role: 'agent' });
    if (!agent) {
      res.status(404).json({ error: 'Agent not found' });
      return;
    }

    ticket.assignedTo = new mongoose.Types.ObjectId(agentId);
    await ticket.save();

    res.json(ticket);
  } catch (error) {
    res.status(400).json({ error: 'Error assigning ticket' });
  }
};

// Get ticket statistics
export const getTicketStats: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const query = req.user?.role === 'admin' ? {} : { createdBy: userId };

    const [openCount, inProgressCount, resolvedCount, urgentCount] = await Promise.all([
      Ticket.countDocuments({ ...query, status: 'open' }),
      Ticket.countDocuments({ ...query, status: 'in_progress' }),
      Ticket.countDocuments({ ...query, status: 'resolved' }),
      Ticket.countDocuments({ ...query, priority: 'urgent' })
    ]);

    res.json({
      open: openCount,
      inProgress: inProgressCount,
      resolved: resolvedCount,
      urgent: urgentCount
    });
  } catch (error: any) {
    console.error('Error fetching ticket stats:', error);
    res.status(500).json({ error: error.message || 'Error fetching ticket statistics' });
  }
};

// Get department tickets for agents
export const getDepartmentTickets: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    if (user.role !== 'agent' || !user.department) {
      res.status(403).json({ message: 'Access denied. Agent with department required.' });
      return;
    }

    const tickets = await Ticket.find({ department: user.department })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching department tickets' });
  }
}; 