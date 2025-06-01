
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Clock, User, Calendar, FileText, Send, Bot, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const TicketDetail = () => {
  const [status, setStatus] = useState('In Progress');
  const [reply, setReply] = useState('');
  const [aiReply, setAiReply] = useState('Thank you for contacting IT support. I understand you\'re having trouble accessing your email account after a password change. Here are the steps to resolve this issue:\n\n1. Please try logging out completely from all email clients\n2. Clear your browser cache and cookies\n3. Try accessing your email through the web portal first\n4. If successful, reconfigure your email client with the new password\n\nIf these steps don\'t resolve the issue, please let me know and I\'ll escalate this to our senior technician.');
  const [internalNote, setInternalNote] = useState('');
  const [showInternalNotes, setShowInternalNotes] = useState(false);

  const ticket = {
    id: 'TK-001',
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

  const internalNotes = [
    {
      id: 1,
      author: 'John Smith',
      timestamp: '2024-01-15 10:50 AM',
      content: 'Checked user account in AD - password change successful. Likely an email client configuration issue. Will guide user through reconfiguration steps.'
    },
    {
      id: 2,
      author: 'John Smith',
      timestamp: '2024-01-15 02:15 PM',
      content: 'User confirmed issue persists across multiple clients. Escalating to check mail server sync status. May need to reset mail profile.'
    }
  ];

  const handleRegenerate = () => {
    setAiReply('I see you\'re experiencing email access issues after your password change. This is a common issue that can usually be resolved quickly. Let me help you with a step-by-step solution:\n\n1. First, let\'s verify your new password works by logging into the company portal\n2. If that works, the issue is with your email client configuration\n3. I\'ll send you updated email settings for your devices\n4. We may need to recreate your email profile if the settings don\'t work\n\nI\'ll also check our mail server logs to ensure there are no authentication issues on our end. Please try the portal login and let me know the result.');
  };

  return (
    <Layout userRole="agent">
      <div className="max-w-6xl mx-auto space-y-6">
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
                  {conversation.map((message, index) => (
                    <div key={message.id}>
                      <div className={`p-4 rounded-lg ${
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
                      {index < conversation.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Suggested Reply */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-blue-600" />
                    AI Suggested Reply
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={handleRegenerate}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
                <CardDescription>
                  AI-generated response based on the ticket content. You can edit or regenerate as needed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={aiReply}
                  onChange={(e) => setAiReply(e.target.value)}
                  className="min-h-[150px] mb-4"
                />
                <div className="flex gap-2">
                  <Button>Use AI Reply</Button>
                  <Button variant="outline">Edit & Send</Button>
                </div>
              </CardContent>
            </Card>

            {/* Manual Reply */}
            <Card>
              <CardHeader>
                <CardTitle>Your Reply</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Type your response to the customer..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  className="min-h-[120px] mb-4"
                />
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Send Reply
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Management */}
            <Card>
              <CardHeader>
                <CardTitle>Ticket Status</CardTitle>
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
                <Button className="w-full">Update Status</Button>
              </CardContent>
            </Card>

            {/* Internal Notes */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Internal Notes</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowInternalNotes(!showInternalNotes)}
                  >
                    {showInternalNotes ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showInternalNotes && (
                  <div className="space-y-4 mb-4">
                    {internalNotes.map((note) => (
                      <div key={note.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{note.author}</span>
                          <span className="text-xs text-gray-500">{note.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{note.content}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                <Textarea
                  placeholder="Add internal note (visible to agents only)..."
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  className="mb-3"
                />
                <Button variant="outline" className="w-full">
                  Add Note
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TicketDetail;
