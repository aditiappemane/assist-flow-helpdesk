import { api } from './api';

export interface TicketData {
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  department: 'IT' | 'HR' | 'Admin';
}

export interface Ticket {
  _id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  department: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  comments: Array<{
    text: string;
    user: {
      _id: string;
      name: string;
    };
    createdAt: string;
  }>;
}

// Create a new ticket
export const createTicket = async (ticketData: TicketData): Promise<Ticket> => {
  const response = await api.post('/tickets', ticketData);
  return response.data.ticket;
};

// Get all tickets for the current user
export const getMyTickets = async (): Promise<Ticket[]> => {
  const response = await api.get('/tickets/my-tickets');
  return response.data;
};

// Get a single ticket
export const getTicket = async (ticketId: string): Promise<Ticket> => {
  const response = await api.get(`/tickets/${ticketId}`);
  return response.data;
};

// Update ticket status
export const updateTicketStatus = async (ticketId: string, status: Ticket['status']): Promise<Ticket> => {
  const response = await api.patch(`/tickets/${ticketId}/status`, { status });
  return response.data.ticket;
};

export async function updateTicket(ticketNumber: string, data: Partial<Ticket>): Promise<Response> {
  const response = await fetch(`${API_URL}/tickets/${ticketNumber}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(data)
  });
  return response;
}

export async function addComment(ticketNumber: string, text: string): Promise<Response> {
  const response = await fetch(`${API_URL}/tickets/${ticketNumber}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ text })
  });
  return response;
} 