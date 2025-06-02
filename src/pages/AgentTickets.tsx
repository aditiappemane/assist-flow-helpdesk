import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getDepartmentTickets } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

const AgentTickets = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getDepartmentTickets();
        setTickets(data);
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
      'open': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'in_progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'resolved': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'closed': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      'on_hold': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'escalated': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig['open'];
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'low': 'bg-gray-100 text-gray-800',
      'medium': 'bg-blue-100 text-blue-800',
      'high': 'bg-orange-100 text-orange-800',
      'urgent': 'bg-red-100 text-red-800',
    };
    return priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig['medium'];
  };

  const handleViewTicket = (ticketId: string) => {
    navigate(`/agent/ticket/${ticketId}?action=view`);
  };

  const handleReplyTicket = (ticketId: string) => {
    navigate(`/agent/ticket/${ticketId}?action=reply`);
  };

  // Filter tickets based on search term and status
  const filteredTickets = tickets.filter((ticket: any) => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Layout userRole="agent">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tickets...</p>
          </div>
        </div>
      </Layout>
    );
  }

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
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tickets List */}
        <div className="space-y-4">
          {filteredTickets.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">No tickets found</p>
              </CardContent>
            </Card>
          ) : (
            filteredTickets.map((ticket: any) => (
              <Card key={ticket._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{ticket.subject}</h3>
                        <Badge className={getStatusBadge(ticket.status)}>
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className={getPriorityBadge(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-3">{ticket.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>ID: {ticket.ticketNumber}</span>
                        <span>From: {ticket.createdBy.name}</span>
                        <span>Submitted: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                        <span>Updated: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => handleReplyTicket(ticket.ticketNumber)}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Reply
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleViewTicket(ticket.ticketNumber)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AgentTickets;
