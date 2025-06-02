import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { getTicket, Ticket, updateTicketStatus } from '@/lib/tickets';
import { useAuth } from '@/lib/auth.tsx';
import Layout from '@/components/Layout';

const statusColors = {
  open: 'bg-blue-500',
  in_progress: 'bg-yellow-500',
  resolved: 'bg-green-500',
  closed: 'bg-gray-500',
};

const priorityColors = {
  low: 'bg-gray-500',
  medium: 'bg-blue-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500',
};

const TicketDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchTicketDetails();
    }
  }, [id]);

  const fetchTicketDetails = async () => {
    try {
      const data = await getTicket(id!);
      setTicket(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch ticket details",
        variant: "destructive",
      });
      navigate('/my-tickets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: Ticket['status']) => {
    try {
      await updateTicketStatus(id!, newStatus);
      await fetchTicketDetails();
      toast({
        title: "Success",
        description: "Ticket status updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update ticket status",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getBackPath = () => {
    if (user?.role === 'superAdmin') return '/admin/tickets';
    if (user?.role === 'agent') return '/agent-tickets';
    return '/my-tickets';
  };

  if (isLoading) {
    return (
      <Layout userRole={user?.role as 'employee' | 'agent' | 'superAdmin'}>
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (!ticket) {
    return (
      <Layout userRole={user?.role as 'employee' | 'agent' | 'superAdmin'}>
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-4">Ticket not found</p>
              <Button onClick={() => navigate(getBackPath())}>
                Back to Tickets
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userRole={user?.role as 'employee' | 'agent' | 'superAdmin'}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Ticket Details</h1>
          <Button variant="outline" onClick={() => navigate(getBackPath())}>
            Back to Tickets
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">{ticket.subject}</CardTitle>
              <div className="flex gap-2">
                <Badge className={statusColors[ticket.status]}>
                  {ticket.status.replace('_', ' ')}
                </Badge>
                <Badge className={priorityColors[ticket.priority]}>
                  {ticket.priority}
                </Badge>
                <Badge variant="outline">
                  {ticket.department}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Created By</h3>
                <p className="text-muted-foreground">
                  {ticket.createdBy.name} ({ticket.createdBy.email})
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Created On</h3>
                <p className="text-muted-foreground">
                  {formatDate(ticket.createdAt)}
                </p>
              </div>
              {ticket.assignedTo && (
                <div>
                  <h3 className="font-semibold mb-2">Assigned To</h3>
                  <p className="text-muted-foreground">
                    {ticket.assignedTo.name} ({ticket.assignedTo.email})
                  </p>
                </div>
              )}
              <div>
                <h3 className="font-semibold mb-2">Last Updated</h3>
                <p className="text-muted-foreground">
                  {formatDate(ticket.updatedAt)}
                </p>
              </div>
            </div>

            {/* Status update buttons for agents and admins */}
            {(user?.role === 'agent' || user?.role === 'admin') && (
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => handleStatusUpdate('in_progress')}
                  disabled={ticket.status === 'in_progress'}
                >
                  Mark In Progress
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleStatusUpdate('resolved')}
                  disabled={ticket.status === 'resolved'}
                >
                  Mark Resolved
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleStatusUpdate('closed')}
                  disabled={ticket.status === 'closed'}
                >
                  Close Ticket
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TicketDetails; 