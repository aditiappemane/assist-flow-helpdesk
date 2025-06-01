
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AgentTickets = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  // Filter tickets based on agent's department
  const allTickets = [
    {
      id: 'TK-001',
      subject: 'Password reset request',
      department: 'IT',
      priority: 'Medium',
      status: 'Open',
      submittedBy: 'Jane Doe',
      date: '2024-01-15',
      lastUpdate: '2024-01-15',
      description: 'Unable to access email account after password change'
    },
    {
      id: 'TK-002',
      subject: 'New hire onboarding',
      department: 'HR',
      priority: 'High',
      status: 'In Progress',
      submittedBy: 'John Smith',
      date: '2024-01-15',
      lastUpdate: '2024-01-15',
      description: 'Need to setup new employee workspace and accounts'
    },
    {
      id: 'TK-003',
      subject: 'Office supplies request',
      department: 'Admin',
      priority: 'Low',
      status: 'Open',
      submittedBy: 'Sarah Wilson',
      date: '2024-01-14',
      lastUpdate: '2024-01-14',
      description: 'Request for additional office supplies for team'
    },
    {
      id: 'TK-004',
      subject: 'VPN connection issues',
      department: 'IT',
      priority: 'High',
      status: 'Escalated',
      submittedBy: 'Robert Wilson',
      date: '2024-01-13',
      lastUpdate: '2024-01-14',
      description: 'Cannot connect to company VPN from home office'
    },
    {
      id: 'TK-005',
      subject: 'Benefits inquiry',
      department: 'HR',
      priority: 'Medium',
      status: 'Resolved',
      submittedBy: 'Emily Chen',
      date: '2024-01-12',
      lastUpdate: '2024-01-13',
      description: 'Questions about health insurance coverage'
    },
  ];

  // Filter tickets by agent's department
  const tickets = userInfo?.department 
    ? allTickets.filter(ticket => ticket.department === userInfo.department)
    : allTickets;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Open': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'Resolved': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Closed': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      'On Hold': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'Escalated': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig['Open'];
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'Low': 'bg-gray-100 text-gray-800',
      'Medium': 'bg-blue-100 text-blue-800',
      'High': 'bg-orange-100 text-orange-800',
      'Urgent': 'bg-red-100 text-red-800',
    };
    return priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig['Medium'];
  };

  const handleViewTicket = (ticketId: string) => {
    navigate(`/ticket/${ticketId.replace('TK-', '')}`);
  };

  const handleReplyTicket = (ticketId: string) => {
    navigate(`/ticket/${ticketId.replace('TK-', '')}`);
  };

  return (
    <Layout userRole="agent">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            All {userInfo?.department || ''} Tickets
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            View all tickets assigned to {userInfo?.department || 'your'} department
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search tickets..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Escalated">Escalated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tickets List */}
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{ticket.subject}</h3>
                      <Badge className={getStatusBadge(ticket.status)}>
                        {ticket.status}
                      </Badge>
                      <Badge variant="outline" className={getPriorityBadge(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-3">{ticket.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>ID: {ticket.id}</span>
                      <span>From: {ticket.submittedBy}</span>
                      <span>Submitted: {ticket.date}</span>
                      <span>Updated: {ticket.lastUpdate}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleReplyTicket(ticket.id)}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleViewTicket(ticket.id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AgentTickets;
