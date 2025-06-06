# AssistFlow Helpdesk

A modern helpdesk application with AI-powered support, built using React, Node.js, and MongoDB.
🔗 **Live Demo Available**: [https://startling-basbousa-49c878.netlify.app](https://startling-basbousa-49c878.netlify.app)
## Features

### AI-Powered Support
- **AskBot**: An AI-powered chat assistant that helps users with common IT issues
- **Smart Ticket Routing**: AI-assisted ticket categorization and routing
- **Automated Responses**: AI-generated initial responses for common issues
- **Knowledge Base Integration**: AI-powered search and suggestions

### User Roles

1. **End Users**
   - Submit and track support tickets
   - Chat with AI assistant (AskBot)
   - View ticket history and status
   - Access knowledge base

2. **Support Agents**
   - View and manage assigned tickets
   - Respond to user queries
   - Update ticket status and priority
   - Access AI-powered response suggestions

3. **Administrators**
   - Manage users and roles
   - Configure AI settings
   - View analytics and reports
   - Manage knowledge base
   - Monitor system performance

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Query for state management
- React Router for navigation

### Backend
- Node.js with Express
- TypeScript
- MongoDB for database
- Google Gemini AI for chat and automation
- JWT for authentication

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- Google Gemini API key
- npm or yarn package manager

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/aditiappemane/assist-flow-helpdesk.git
   cd assist-flow-helpdesk
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the backend directory:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/helpdesk
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   NODE_ENV=development
   ```

4. **Start the development servers**

   In the root directory:
   ```bash
   # Start frontend (in one terminal)
   npm run dev

   # Start backend (in another terminal)
   cd backend
   npm run dev
   ```

   The frontend will be available at `http://localhost:8080`
   The backend will be available at `http://localhost:3000`

## AI Features Implementation

### 1. AskBot Chat Assistant
- Powered by Google's Gemini AI
- Context-aware responses for IT support
- Step-by-step troubleshooting guidance
- Integration with knowledge base

### 2. Smart Ticket Management
- **Automatic Department Categorization**
  - AI-powered analysis of ticket content
  - Automatic routing to IT, HR, or Admin departments
  - Confidence scoring for categorization
  - Explanation of categorization decisions
- Priority assessment
- Suggested solutions based on ticket content
- Duplicate ticket detection

### 3. Automated Support
- Initial response generation
- Common issue resolution suggestions
- Knowledge base article recommendations
- Follow-up question handling

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Tickets
- `GET /api/tickets` - List tickets
- `POST /api/tickets` - Create ticket
- `GET /api/tickets/:id` - Get ticket details
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket

### Chat
- `POST /api/chat` - Send message to AskBot
- `GET /api/chat/history` - Get chat history

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@assistflow.com or create an issue in the repository.
