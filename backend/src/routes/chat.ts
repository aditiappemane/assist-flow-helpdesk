import express from 'express';
import { GEMINI_API_URL, GEMINI_API_KEY } from '../config/ai';
import axios from 'axios';

const router = express.Router();

// System prompt to guide the AI's responses
const SYSTEM_PROMPT = `You are a helpful IT support assistant for a company help desk. 
Your role is to provide clear, concise, and accurate information about IT-related issues.
Focus on:
1. Providing step-by-step solutions when possible
2. Suggesting relevant resources or documentation
3. Guiding users to submit tickets when necessary
4. Maintaining a professional and friendly tone
5. Being clear about what you can and cannot help with

Common topics you can help with:
- Password resets and account access
- Software installation and updates
- Hardware issues and troubleshooting
- Email and communication tools
- Network and VPN access
- General IT policies and procedures`;

async function getGeminiResponse(message: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          role: "user",
          parts: [{
            text: `${SYSTEM_PROMPT}\n\nUser: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini API');
    }

    return response.data.candidates[0].content.parts[0].text;
  } catch (error: any) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || 'Failed to get response from Gemini API');
  }
}

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get response from Gemini API
    const aiResponse = await getGeminiResponse(message);

    res.json({
      message: aiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    
    // Handle specific error cases
    if (error.message.includes('API key is not configured')) {
      res.status(500).json({ 
        error: 'Chat service is not properly configured',
        details: 'Please contact the system administrator'
      });
      return;
    }

    if (error.message.includes('Gemini API error')) {
      res.status(502).json({ 
        error: 'Chat service is temporarily unavailable',
        details: 'Please try again later'
      });
      return;
    }

    // Default error response
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
});

export default router; 