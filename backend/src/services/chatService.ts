import { Configuration, OpenAIApi } from 'openai';
import knowledgeBaseData from '../data/knowledgeBase.json';
import { Ticket } from '../models/Ticket';

interface ChatResponse {
  message: string;
}

interface Policy {
  id: number;
  content: string;
}

interface KnowledgeBase {
  policies: Policy[];
}

// Cast the imported JSON to our KnowledgeBase type
const knowledgeBase = knowledgeBaseData as KnowledgeBase;

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// System prompt with knowledge base context
const SYSTEM_PROMPT = `You are an AI assistant for a company help desk. 
Respond to user queries using only the provided company policy information below. Do not use general knowledge or reference the source of the information.

Company Policy Information:
${knowledgeBase.policies.map(policy => `- ${policy.content}`).join('\n')}

Guidelines:
1. Respond only if the answer clearly exists in the provided policy content.
2. If the information is not available, politely suggest the user submit a support ticket.
3. Limit responses to a maximum of 3 clear, professional sentences.
4. Never mention or refer to the knowledge base or policy source in your answer.
5. Do not make assumptions, guesses, or generate creative content.
6. Maintain a concise, helpful, and friendly tone.`;



export async function getChatResponse(message: string, ticketData?: any): Promise<ChatResponse> {
  try {
    // Prepare the conversation with context
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `User Query: ${message}\n\n${ticketData ? `Relevant Ticket Data: ${JSON.stringify(ticketData, null, 2)}` : ''}` }
    ];

    // Get response from OpenAI
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.data.choices[0]?.message?.content || "I apologize, but I couldn't process your request. Please try again or submit a ticket.";

    return {
      message: response
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return {
      message: "I apologize, but I'm having trouble processing your request. Please submit a support ticket for assistance."
    };
  }
} 