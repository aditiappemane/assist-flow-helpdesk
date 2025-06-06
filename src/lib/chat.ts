export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export interface ChatError {
  error: string;
}

export interface ChatResponse {
  message: string;
  timestamp: string;
}

export interface TicketData {
  ticketNumber: string;
  subject: string;
  description: string;
  status: string;
  department: string;
  priority: string;
  createdAt: string;
}

const API_URL = 'https://assist-flow-helpdesk.onrender.com/api/chat';

export async function sendMessage(message: string, ticketId?: string): Promise<ChatResponse> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, ticketId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send message');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
} 