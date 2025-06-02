import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from '../hooks/use-toast';
import { useAuth } from '../lib/auth';
import { getTicket, updateTicket, addComment, Ticket } from '../lib/tickets';
import { ReplyField } from '../components/ReplyField';
import Layout from '../components/Layout';

const AgentTicketDetail = () => {
  const { ticketNumber } = useParams<{ ticketNumber: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [action, setAction] = useState<'reply' | null>(null);

  useEffect(() => {
    // Set action from URL query parameter
    const actionParam = searchParams.get('action');
    if (actionParam === 'reply') {
      setAction('reply');
    }
  }, [searchParams]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const data = await getTicket(ticketNumber!);
      setTicket(data);
      setError(null);
    } catch (err) {
      setError('Failed to load ticket');
      toast({
        title: "Error",
        description: "Failed to load ticket",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketNumber) {
      fetchTicket();
    }
  }, [ticketNumber]);

  const handleStatusChange = async (newStatus: 'open' | 'in_progress' | 'resolved' | 'closed') => {
    if (!ticket) return;

    try {
      await updateTicket(ticket._id, { status: newStatus });
      toast({
        title: "Success",
        description: "Status updated successfully",
      });
      fetchTicket();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handlePriorityChange = async (newPriority: 'low' | 'medium' | 'high' | 'urgent') => {
    if (!ticket) return;

    try {
      await updateTicket(ticket._id, { priority: newPriority });
      toast({
        title: "Success",
        description: "Priority updated successfully",
      });
      fetchTicket();
    } catch (error) {
      console.error('Error updating priority:', error);
      toast({
        title: "Error",
        description: "Failed to update priority",
        variant: "destructive",
      });
    }
  };

  const handleAddComment = async (message: string) => {
    try {
      if (!ticket) return;

      await addComment(ticket._id, message);
      toast({
        title: "Success",
        description: "Reply sent successfully",
      });
      fetchTicket(); // Refresh ticket data
      setAction(null); // Clear the reply action
      // Update URL to remove the action parameter
      navigate(`/agent/ticket/${ticketNumber}`);
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Layout userRole="agent">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading ticket...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !ticket) {
    return (
      <Layout userRole="agent">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600">Error: {error || 'Ticket not found'}</p>
            <Button variant="outline" onClick={() => navigate('/agent/tickets')} className="mt-4">
              Back to Tickets
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userRole="agent">
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/agent/tickets')}>
            Back to Tickets
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Ticket #{ticket.ticketNumber}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">{ticket.subject}</p>
                </div>
                <div className="flex gap-2">
                  <Select
                    value={ticket.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={ticket.priority}
                    onValueChange={handlePriorityChange}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Description</h3>
                  <p className="text-gray-600 mt-1">{ticket.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Created By</h3>
                    <p className="text-gray-600">{ticket.createdBy.name}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Department</h3>
                    <p className="text-gray-600">{ticket.department}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Created At</h3>
                    <p className="text-gray-600">
                      {new Date(ticket.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Last Updated</h3>
                    <p className="text-gray-600">
                      {new Date(ticket.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Comments</CardTitle>
                {action !== 'reply' && (
                  <Button onClick={() => navigate(`/agent/ticket/${ticketNumber}?action=reply`)}>
                    Add Reply
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ticket.comments.map((comment, index) => (
                  <div key={index} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-medium">{comment.user.name}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 whitespace-pre-wrap">{comment.text}</p>
                  </div>
                ))}

                {action === 'reply' && (
                  <div className="mt-4">
                    <ReplyField
                      onSend={handleAddComment}
                      placeholder="Type your reply to the user..."
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AgentTicketDetail;
