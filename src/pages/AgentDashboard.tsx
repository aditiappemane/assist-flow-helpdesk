import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Filter, CalendarIcon, Eye, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const AgentDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  // All tickets data
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
      id: 'TK-005',
      subject: 'VPN connection issues',
      department: 'IT',
      priority: 'High',
      status: 'In Progress',
      submittedBy: 'Robert Wilson',
      date: '2024-01-15',
      lastUpdate: '2024-01-15',
      description: 'Cannot connect to company VPN from home office'
    },
    {
      id: 'TK-006',
      subject: 'Software installation request',
      department: 'IT',
      priority: 'Low',
      status: 'On Hold',
      submittedBy: 'Emily Chen',
      date: '2024-01-14',
      lastUpdate: '2024-01-14',
      description: 'Need Adobe Photoshop installed on workstation'
    },
    {
      id: 'TK-007',
      subject: 'Hardware malfunction',
      department: 'IT',
      priority: 'Urgent',
      status: 'Escalated',
      submittedBy: 'Michael Brown',
      date: '2024-01-13',
      lastUpdate: '2024-01-14',
      description: 'Laptop screen flickering, affecting productivity'
    },
    {
      id: 'TK-008',
      subject: 'Email configuration',
      department: 'IT',
      priority: 'Medium',
      status: 'Resolved',
      submittedBy: 'Lisa Garcia',
      date: '2024-01-12',
      lastUpdate: '2024-01-13',
      description: 'Need help setting up email on mobile device'
    },
    {
      id: 'TK-009',
      subject: 'Benefits inquiry',
      department: 'HR',
      priority: 'Medium',
      status: 'Open',
      submittedBy: 'John Smith',
      date: '2024-01-15',
      lastUpdate: '2024-01-15',
      description: 'Questions about health insurance coverage'
    },
    {
      id: 'TK-010',
      subject: 'New hire onboarding',
      department: 'HR',
      priority: 'High',
      status: 'In Progress',
      submittedBy: 'Sarah Wilson',
      date: '2024-01-14',
      lastUpdate: '2024-01-14',
      description: 'Need to setup new employee workspace and accounts'
    },
    {
      id: 'TK-011',
      subject: 'Office supplies request',
      department: 'Admin',
      priority: 'Low',
      status: 'Open',
      submittedBy: 'Mike Johnson',
      date: '2024-01-14',
      lastUpdate: '2024-01-14',
      description: 'Request for additional office supplies for team'
    },
    {
      id: 'TK-012',
      subject: 'Meeting room booking',
      department: 'Admin',
      priority: 'Medium',
      status: 'Resolved',
      submittedBy: 'Lisa Brown',
      date: '2024-01-13',
      lastUpdate: '2024-01-13',
      description: 'Need to book conference room for quarterly meeting'
    }
  ];

  // Filter tickets by agent's department
  const tickets = userInfo?.department 
    ? allTickets.filter(ticket => ticket.department === userInfo.department)
    : allTickets;

  const stats = [
    { title: 'Total Assigned', value: tickets.length, color: 'text-blue-600' },
    { title: 'Open', value: tickets.filter(t => t.status === 'Open').length, color: 'text-orange-600' },
    { title: 'In Progress', value: tickets.filter(t => t.status === 'In Progress').length, color: 'text-yellow-600' },
    { title: 'Resolved Today', value: tickets.filter(t => t.status === 'Resolved').length, color: 'text-green-600' },
  ];

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
    navigate(`/agent/ticket/${ticketId}?action=view`);
  };

  const handleReplyTicket = (ticketId: string) => {
    navigate(`/agent/ticket/${ticketId}?action=reply`);
  };

  return (
    <Layout userRole="agent">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {userInfo?.department || ''} Agent Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your assigned {userInfo?.department || ''} tickets and support requests
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search tickets..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
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

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "MMM dd") : "From Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "MMM dd") : "To Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
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

export default AgentDashboard;
