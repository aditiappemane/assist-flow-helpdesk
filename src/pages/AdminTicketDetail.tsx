
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, User, Calendar, FileText, Users } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';

const AdminTicketDetail = () => {
  const { id } = useParams();
  const [status, setStatus] = useState('In Progress');
  const [assignedAgent, setAssignedAgent] = useState('John Smith');

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

  const availableAgents = [
    'John Smith (IT)',
    'Sarah Wilson (IT)',
    'Mike Johnson (HR)',
    'Lisa Brown (HR)',
    'David Clark (Admin)',
    'Emma Davis (Admin)'
  ];

  const handleUpdateStatus = () => {
    toast({
      title: "Status Updated",
      description: `Ticket status has been changed to ${status}.`,
    });
  };

  const handleReassignTicket = () => {
    toast({
      title: "Ticket Reassigned",
      description: `Ticket has been reassigned to ${assignedAgent}.`,
    });
  };

  return (
    <Layout userRole="superAdmin">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{ticket.subject}</h1>
            <p className="text-gray-600 dark:text-gray-300">Ticket ID: {ticket.id}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-100 text-purple-800">
              {ticket.department}
            </Badge>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Information */}
            <Card>
              <CardHeader>
                <CardTitle>Ticket Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Submitted by:</span>
                    <span>{ticket.submittedBy}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
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
                        <Button key={index} variant="outline" size="sm" className="mr-2">
                          {file}
                        </Button>
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

          {/* Admin Controls Sidebar */}
          <div className="space-y-6">
            {/* Status Management */}
            <Card>
              <CardHeader>
                <CardTitle>Ticket Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Change Status</label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                      <SelectItem value="Escalated">Escalated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={handleUpdateStatus}>Update Status</Button>
              </CardContent>
            </Card>

            {/* Reassignment */}
            <Card>
              <CardHeader>
                <CardTitle>Reassign Ticket</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Assign to Agent</label>
                  <Select value={assignedAgent} onValueChange={setAssignedAgent}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableAgents.map((agent) => (
                        <SelectItem key={agent} value={agent.split(' (')[0]}>
                          {agent}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={handleReassignTicket}>
                  <Users className="h-4 w-4 mr-2" />
                  Reassign Ticket
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminTicketDetail;
