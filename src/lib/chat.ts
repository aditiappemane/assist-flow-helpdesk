export interface ChatMessage {
  message: string;
  timestamp: string;
}

export interface ChatError {
  error: string;
}

export interface ChatResponse {
  message: string;
  timestamp: string;
}

const API_URL = 'http://localhost:5000/api/chat'; // Updated to match backend port

export async function sendMessage(message: string): Promise<ChatResponse> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
      credentials: 'include', // Include cookies for authentication
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send message');
    }

    const data = await response.json();
    return {
      message: data.message,
      timestamp: data.timestamp,
    };
  } catch (error) {
    console.error('Chat service error:', error);
    throw error;
  }
} 