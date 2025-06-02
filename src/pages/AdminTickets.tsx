import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, MessageSquare, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

const AdminTickets = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/tickets/all');
        setTickets(response.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch tickets. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

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

  const getDepartmentBadge = (department: string) => {
    const departmentConfig = {
      'IT': 'bg-purple-100 text-purple-800',
      'HR': 'bg-green-100 text-green-800',
      'Admin': 'bg-orange-100 text-orange-800',
    };
    return departmentConfig[department as keyof typeof departmentConfig] || 'bg-gray-100 text-gray-800';
  };

  const handleViewTicket = (ticketId: string) => {
    // Use the full ticket ID (e.g., TK-001)
    navigate(`/admin/ticket/${ticketId}`);
  };

  const handleReassignTicket = (ticketId: string) => {
    // This would open a reassignment modal
    console.log(`Reassigning ticket ${ticketId}`);
  };

  // Filter tickets based on search term and filters
  const filteredTickets = tickets.filter((ticket: any) => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || ticket.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  if (loading) {
    return (
      <Layout userRole="superAdmin">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userRole="superAdmin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Tickets</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage and oversee all support tickets across all departments
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tickets List */}
        <div className="space-y-4">
          {filteredTickets.map((ticket: any) => (
            <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{ticket.subject}</h3>
                      <Badge className={getDepartmentBadge(ticket.department)}>
                        {ticket.department}
                      </Badge>
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
                      <span>Assigned to: {ticket.assignedTo}</span>
                      <span>Submitted: {ticket.date}</span>
                      <span>Updated: {ticket.lastUpdate}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleReassignTicket(ticket.id)}>
                      <Users className="h-4 w-4 mr-2" />
                      Reassign
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

export default AdminTickets;
