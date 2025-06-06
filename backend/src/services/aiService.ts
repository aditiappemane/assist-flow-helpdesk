import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

interface TicketDetails {
  subject: string;
  description: string;
  priority?: string;
  attachments?: string[];
}

interface TicketAssignment {
  department: 'IT' | 'HR' | 'Admin';
  confidence: number;
  reason: string;
}

const SYSTEM_PROMPT = `You are an IT support ticket routing assistant. Your task is to analyze ticket details and assign them to the most appropriate department.

Available departments and their responsibilities:
- IT: Technical issues, software problems, hardware issues, network problems, system access
- HR: Employee relations, benefits, policies, training, recruitment
- Admin: Administrative tasks, office management, facilities, general inquiries

Guidelines for assignment:
1. IT Department:
   - Software installation and updates
   - Hardware problems
   - Network connectivity issues
   - System access and permissions
   - Technical support requests

2. HR Department:
   - Employee benefits
   - Workplace policies
   - Training requests
   - Recruitment inquiries
   - Employee relations

3. Admin Department:
   - Office supplies
   - Facility maintenance
   - General administrative tasks
   - Document processing
   - Non-technical inquiries

Analyze the ticket details and respond in JSON format:
{
  "department": "IT|HR|Admin",
  "confidence": number between 0 and 1,
  "reason": "brief explanation for the assignment"
}`;

export const categorizeTicket = async (ticketDetails: TicketDetails): Promise<TicketAssignment> => {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { 
          role: "user", 
          content: JSON.stringify({
            subject: ticketDetails.subject,
            description: ticketDetails.description,
            priority: ticketDetails.priority,
            attachments: ticketDetails.attachments
          })
        }
      ],
      temperature: 0.7,
    });

    const response = completion.data.choices[0].message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    const result = JSON.parse(response) as TicketAssignment;
    
    // Validate the response
    if (!['IT', 'HR', 'Admin'].includes(result.department)) {
      throw new Error('Invalid department in AI response');
    }
    
    if (typeof result.confidence !== 'number' || result.confidence < 0 || result.confidence > 1) {
      throw new Error('Invalid confidence score in AI response');
    }

    return result;
  } catch (error) {
    console.error('Error in AI ticket categorization:', error);
    // Fallback to IT department with low confidence if AI fails
    return {
      department: 'IT',
      confidence: 0.5,
      reason: 'Error in AI categorization, defaulting to IT department'
    };
  }
}; 