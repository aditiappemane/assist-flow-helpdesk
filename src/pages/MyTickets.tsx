import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { getMyTickets, Ticket } from '@/lib/tickets';
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

const MyTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const data = await getMyTickets();
      setTickets(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch tickets",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewTicket = (ticketNumber: string) => {
    navigate(`/tickets/${ticketNumber}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Layout userRole="employee">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Tickets</h1>
          <Button onClick={() => navigate('/submit-ticket')}>
            Create New Ticket
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
          </div>
        ) : tickets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-4">You haven't created any tickets yet.</p>
              <Button onClick={() => navigate('/submit-ticket')}>
                Create Your First Ticket
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Card key={ticket._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{ticket.subject}</h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {ticket.description}
                      </p>
                      <div className="flex gap-2 mb-4">
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
                      <p className="text-sm text-muted-foreground">
                        Created on {formatDate(ticket.createdAt)}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleViewTicket(ticket.ticketNumber)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyTickets;
