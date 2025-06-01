import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, FileText, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const recentTickets = [
    { id: 1, subject: 'Password reset request', status: 'In Progress', department: 'IT', date: '2024-01-15' },
    { id: 2, subject: 'New hire equipment setup', status: 'Open', department: 'HR', date: '2024-01-14' },
    { id: 3, subject: 'Office space request', status: 'Resolved', department: 'Admin', date: '2024-01-13' },
  ];

  const stats = [
    { title: 'Open Tickets', value: 12, icon: FileText, color: 'text-blue-600' },
    { title: 'In Progress', value: 5, icon: Clock, color: 'text-yellow-600' },
    { title: 'Resolved', value: 28, icon: CheckCircle, color: 'text-green-600' },
    { title: 'Urgent', value: 3, icon: AlertCircle, color: 'text-red-600' },
  ];

  const handleViewTicket = (ticketId: number) => {
    navigate(`/ticket/${ticketId}`);
  };

  return (
    <Layout userRole="employee">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Welcome back! Here's what's happening with your tickets.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/submit-ticket">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="flex items-center p-6">
                <Plus className="h-8 w-8 text-blue-600 mr-4" />
                <div>
                  <h3 className="font-semibold">Submit New Ticket</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Get help with your request</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/my-tickets">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="flex items-center p-6">
                <FileText className="h-8 w-8 text-green-600 mr-4" />
                <div>
                  <h3 className="font-semibold">View My Tickets</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Track your submissions</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/ask-bot">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="flex items-center p-6">
                <MessageSquare className="h-8 w-8 text-purple-600 mr-4" />
                <div>
                  <h3 className="font-semibold">Ask AI Assistant</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Get instant help</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="flex items-center p-6">
                <stat.icon className={`h-8 w-8 ${stat.color} mr-4`} />
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Tickets */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tickets</CardTitle>
            <CardDescription>Your latest support requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{ticket.subject}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {ticket.department} • {ticket.date}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.status === 'Open' ? 'bg-blue-100 text-blue-800' :
                      ticket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {ticket.status}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => handleViewTicket(ticket.id)}>
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
