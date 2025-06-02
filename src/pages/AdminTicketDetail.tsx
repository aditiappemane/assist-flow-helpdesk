import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, User, Calendar, FileText, Users, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

const AdminTicketDetail = () => {
  const { ticketNumber } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [assignedAgent, setAssignedAgent] = useState('');

  useEffect(() => {
    const fetchTicket = async () => {
      if (!ticketNumber) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/tickets/${ticketNumber}`);
        setTicket(response.data);
        setStatus(response.data.status);
        setPriority(response.data.priority);
        setAssignedAgent(response.data.assignedTo);
      } catch (error) {
        console.error('Error fetching ticket:', error);
        toast({
          title: "Error",
          description: "Failed to fetch ticket details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketNumber]);

  const handleStatusChange = async (newStatus: string) => {
    if (!ticketNumber) return;

    try {
      await api.patch(`/tickets/${ticketNumber}`, { status: newStatus });
      setStatus(newStatus);
      toast({
        title: "Success",
        description: "Ticket status updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update ticket status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    if (!ticketNumber) return;

    try {
      await api.patch(`/tickets/${ticketNumber}`, { priority: newPriority });
      setPriority(newPriority);
      toast({
        title: "Success",
        description: "Ticket priority updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update ticket priority. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAssignAgent = async (newAgent: string) => {
    if (!ticketNumber) return;

    try {
      await api.patch(`/tickets/${ticketNumber}`, { assignedTo: newAgent });
      setAssignedAgent(newAgent);
      toast({
        title: "Success",
        description: "Ticket assigned successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign ticket. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Layout userRole="superAdmin">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  if (!ticket) {
    return (
      <Layout userRole="superAdmin">
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-bold mb-4">Ticket not found</h2>
          <Button onClick={() => navigate('/admin/tickets')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tickets
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userRole="superAdmin">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{ticket.subject}</h1>
            <p className="text-gray-600 dark:text-gray-300">Ticket ID: {ticket.ticketNumber}</p>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span>Submitted by: {ticket.createdBy?.name || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span>Assigned to: {ticket.assignedTo?.name || 'Unassigned'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Submitted: {new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>Last update: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={priority} onValueChange={handlePriorityChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
              {ticket.description}
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={() => navigate('/admin/tickets')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tickets
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default AdminTicketDetail;
