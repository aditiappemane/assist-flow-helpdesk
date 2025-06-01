
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Eye } from 'lucide-react';

const MyTickets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const tickets = [
    {
      id: 'TK-001',
      subject: 'Password reset request',
      department: 'IT',
      priority: 'Medium',
      status: 'In Progress',
      date: '2024-01-15',
      assignedTo: 'John Smith',
      description: 'Unable to access email account after password change'
    },
    {
      id: 'TK-002',
      subject: 'New hire equipment setup',
      department: 'HR',
      priority: 'High',
      status: 'Open',
      date: '2024-01-14',
      assignedTo: 'Sarah Johnson',
      description: 'Need laptop and desk setup for new employee starting Monday'
    },
    {
      id: 'TK-003',
      subject: 'Office space request',
      department: 'Admin',
      priority: 'Low',
      status: 'Resolved',
      date: '2024-01-13',
      assignedTo: 'Mike Davis',
      description: 'Request for quiet workspace near conference room'
    },
    {
      id: 'TK-004',
      subject: 'Software license renewal',
      department: 'IT',
      priority: 'Urgent',
      status: 'Escalated',
      date: '2024-01-12',
      assignedTo: 'John Smith',
      description: 'Adobe Creative Suite license expires tomorrow'
    },
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

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || ticket.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <Layout userRole="employee">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Tickets</h1>
          <p className="text-gray-600 dark:text-gray-300">Track and manage your support requests</p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search tickets by subject or content..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="IT">IT Support</SelectItem>
                  <SelectItem value="HR">Human Resources</SelectItem>
                  <SelectItem value="Admin">Administration</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
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
          {filteredTickets.map((ticket) => (
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
                      <span>Ticket: {ticket.id}</span>
                      <span>Department: {ticket.department}</span>
                      <span>Assigned to: {ticket.assignedTo}</span>
                      <span>Created: {ticket.date}</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="ml-4">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTickets.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-500 dark:text-gray-400">
                <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No tickets found</h3>
                <p>Try adjusting your search criteria or submit a new ticket.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default MyTickets;
