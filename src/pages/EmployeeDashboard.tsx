import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyTickets } from '../lib/tickets';
import { Ticket } from '../lib/tickets';
import { useAuth } from '../lib/auth';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab';
import { format } from 'date-fns';

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentTickets = async () => {
      try {
        setLoading(true);
        const tickets = await getMyTickets();
        console.log('Fetched tickets:', tickets); // Debug log
        // Sort tickets by creation date and get the 5 most recent ones
        const sortedTickets = tickets
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        console.log('Sorted tickets:', sortedTickets); // Debug log
        setRecentTickets(sortedTickets);
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError('Failed to fetch recent tickets');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRecentTickets();
    }
  }, [user]);

  const getStatusColor = (status: string): 'primary' | 'warning' | 'success' | 'grey' | 'info' => {
    switch (status) {
      case 'open':
        return 'primary';
      case 'in_progress':
        return 'warning';
      case 'resolved':
        return 'success';
      case 'closed':
        return 'grey';
      default:
        return 'info';
    }
  };

  const getPriorityColor = (priority: string): 'error' | 'warning' | 'success' | 'info' => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'info';
    }
  };

  if (!user) {
    return (
      <Container>
        <Alert severity="error">Please log in to view your dashboard</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Welcome Section */}
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Welcome, {user.name}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Here's an overview of your recent support tickets and activities.
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Recent Tickets Section */}
          <Box sx={{ flex: 2 }}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">Recent Tickets</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/my-tickets')}
                  >
                    View All Tickets
                  </Button>
                </Box>

                {loading ? (
                  <Box display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                  </Box>
                ) : error ? (
                  <Alert severity="error">{error}</Alert>
                ) : recentTickets.length === 0 ? (
                  <Alert severity="info">No recent tickets found</Alert>
                ) : (
                  <Timeline>
                    {recentTickets.map((ticket) => (
                      <TimelineItem key={ticket._id}>
                        <TimelineSeparator>
                          <TimelineDot color={getStatusColor(ticket.status)} />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                          <Box mb={1}>
                            <Typography variant="subtitle1" component="span">
                              {ticket.subject}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ ml: 1 }}
                            >
                              {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                            </Typography>
                          </Box>
                          <Box display="flex" gap={1} mb={1}>
                            <Typography
                              variant="caption"
                              sx={{
                                bgcolor: `${getStatusColor(ticket.status)}.light`,
                                color: `${getStatusColor(ticket.status)}.dark`,
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                              }}
                            >
                              {ticket.status.replace('_', ' ')}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                bgcolor: `${getPriorityColor(ticket.priority)}.light`,
                                color: `${getPriorityColor(ticket.priority)}.dark`,
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                              }}
                            >
                              {ticket.priority}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {ticket.description.length > 100
                              ? `${ticket.description.substring(0, 100)}...`
                              : ticket.description}
                          </Typography>
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* Quick Actions Section */}
          <Box sx={{ flex: 1 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/submit-ticket')}
                  >
                    Submit New Ticket
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/my-tickets')}
                  >
                    View My Tickets
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/ask-bot')}
                  >
                    Ask Support Bot
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Container>
  );
} 