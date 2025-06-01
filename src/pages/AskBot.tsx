
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, Lightbulb, Search, Book } from 'lucide-react';

const AskBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your AI assistant. I can help you with common IT, HR, and Admin questions. What can I help you with today?",
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const commonQuestions = [
    "How do I reset my password?",
    "Where can I find the employee handbook?",
    "How do I request time off?",
    "Who do I contact for IT support?",
    "How to set up VPN access?",
    "Where is the office printer located?"
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    // Simulate AI response
    const botResponse = {
      id: messages.length + 2,
      type: 'bot',
      content: generateResponse(inputMessage),
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage, botResponse]);
    setInputMessage('');
  };

  const generateResponse = (question: string) => {
    const responses = {
      password: "To reset your password:\n1. Go to the IT self-service portal\n2. Click 'Forgot Password'\n3. Enter your email address\n4. Check your email for reset instructions\n\nIf you're still having trouble, please submit an IT ticket for assistance.",
      handbook: "The employee handbook is available on the company intranet under 'HR Resources'. You can also find it in your onboarding documents or request a copy from HR.",
      timeoff: "To request time off:\n1. Log into the HR portal\n2. Navigate to 'Time Off Requests'\n3. Select your dates and reason\n4. Submit for manager approval\n\nMake sure to submit requests at least 2 weeks in advance when possible.",
      default: "I understand you're looking for help with that. Based on your question, I'd recommend:\n\n1. Checking our FAQ section\n2. Searching the knowledge base\n3. Submitting a ticket to the appropriate department\n\nWould you like me to help you with any of these options?"
    };

    const lowerQ = question.toLowerCase();
    if (lowerQ.includes('password') || lowerQ.includes('reset')) return responses.password;
    if (lowerQ.includes('handbook') || lowerQ.includes('manual')) return responses.handbook;
    if (lowerQ.includes('time off') || lowerQ.includes('vacation') || lowerQ.includes('leave')) return responses.timeoff;
    return responses.default;
  };

  const handleQuestionClick = (question: string) => {
    setInputMessage(question);
  };

  return (
    <Layout userRole="employee">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Assistant</h1>
          <p className="text-gray-600 dark:text-gray-300">Get instant answers to your questions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  Chat with AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {message.type === 'user' ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                          <span className="text-xs opacity-75">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="whitespace-pre-line">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your question here..."
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Common Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  Common Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {commonQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full text-left justify-start h-auto p-3"
                      onClick={() => handleQuestionClick(question)}
                    >
                      <div className="text-sm">{question}</div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Search className="h-4 w-4 mr-2" />
                  Search Knowledge Base
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Book className="h-4 w-4 mr-2" />
                  Browse FAQ
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Send className="h-4 w-4 mr-2" />
                  Submit a Ticket
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AskBot;
