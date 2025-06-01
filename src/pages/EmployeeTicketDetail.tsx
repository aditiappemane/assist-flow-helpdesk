
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Calendar, FileText } from 'lucide-react';
import { useParams } from 'react-router-dom';

const EmployeeTicketDetail = () => {
  const { id } = useParams();

  const ticket = {
    id: `TK-${id?.padStart(3, '0')}`,
    subject: 'Password reset request',
    description: 'I recently changed my password as required by company policy, but now I cannot access my email account. I\'ve tried logging in multiple times with the new password, but it keeps saying the credentials are invalid. This is preventing me from doing my work effectively. Please help me resolve this issue as soon as possible.',
    department: 'IT',
    priority: 'Medium',
    status: 'In Progress',
    submittedBy: 'Jane Doe',
    submittedDate: '2024-01-15 09:30 AM',
    lastUpdate: '2024-01-15 02:15 PM',
    assignedTo: 'John Smith',
    dueDate: '2024-01-17',
    attachments: ['screenshot_error.png', 'email_settings.pdf']
  };

  const conversation = [
    {
      id: 1,
      type: 'user',
      author: 'Jane Doe',
      timestamp: '2024-01-15 09:30 AM',
      content: ticket.description
    },
    {
      id: 2,
      type: 'agent',
      author: 'John Smith',
      timestamp: '2024-01-15 10:45 AM',
      content: 'Hi Jane, thank you for reporting this issue. I\'ve received your ticket and I\'m looking into the password reset problem. Can you please confirm which email client you\'re using (Outlook, Apple Mail, etc.) and whether you\'re trying to access email on desktop, mobile, or both?'
    },
    {
      id: 3,
      type: 'user',
      author: 'Jane Doe',
      timestamp: '2024-01-15 11:20 AM',
      content: 'Hi John, I\'m using Outlook on my desktop computer and also trying to access email through the web browser. Both are giving me authentication errors. I\'m also having trouble on my iPhone mail app.'
    }
  ];

  return (
    <Layout userRole="employee">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{ticket.subject}</h1>
            <p className="text-gray-600 dark:text-gray-300">Ticket ID: {ticket.id}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={`${
              ticket.status === 'Open' ? 'bg-blue-100 text-blue-800' :
              ticket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {ticket.status}
            </Badge>
            <Badge variant="outline" className={`${
              ticket.priority === 'Low' ? 'bg-gray-100 text-gray-800' :
              ticket.priority === 'Medium' ? 'bg-blue-100 text-blue-800' :
              ticket.priority === 'High' ? 'bg-orange-100 text-orange-800' :
              'bg-red-100 text-red-800'
            }`}>
              {ticket.priority}
            </Badge>
          </div>
        </div>

        {/* Ticket Information */}
        <Card>
          <CardHeader>
            <CardTitle>Ticket Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Assigned to:</span>
                <span>{ticket.assignedTo}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Due:</span>
                <span>{ticket.dueDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Created:</span>
                <span>{ticket.submittedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Department:</span>
                <span>{ticket.department}</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Description:</h4>
              <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                {ticket.description}
              </p>
            </div>

            {ticket.attachments.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Attachments:</h4>
                <div className="space-y-1">
                  {ticket.attachments.map((file, index) => (
                    <span key={index} className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-2">
                      {file}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conversation History */}
        <Card>
          <CardHeader>
            <CardTitle>Conversation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversation.map((message) => (
                <div key={message.id} className={`p-4 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-blue-50 dark:bg-blue-900/20' 
                    : 'bg-gray-50 dark:bg-gray-800'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{message.author}</span>
                    <span className="text-sm text-gray-500">{message.timestamp}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{message.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EmployeeTicketDetail;
