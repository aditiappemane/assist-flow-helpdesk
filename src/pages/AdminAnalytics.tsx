
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Users, Clock, FileText, AlertTriangle } from 'lucide-react';

const AdminAnalytics = () => {
  const departmentData = [
    { name: 'IT', tickets: 45, resolved: 38, pending: 7 },
    { name: 'HR', tickets: 32, resolved: 28, pending: 4 },
    { name: 'Admin', tickets: 23, resolved: 20, pending: 3 },
  ];

  const priorityData = [
    { name: 'Low', value: 35, color: '#94A3B8' },
    { name: 'Medium', value: 45, color: '#3B82F6' },
    { name: 'High', value: 15, color: '#F59E0B' },
    { name: 'Urgent', value: 5, color: '#EF4444' },
  ];

  const trendData = [
    { name: 'Mon', tickets: 12, resolved: 10 },
    { name: 'Tue', tickets: 15, resolved: 13 },
    { name: 'Wed', tickets: 18, resolved: 16 },
    { name: 'Thu', tickets: 14, resolved: 12 },
    { name: 'Fri', tickets: 20, resolved: 18 },
    { name: 'Sat', tickets: 8, resolved: 7 },
    { name: 'Sun', tickets: 5, resolved: 5 },
  ];

  const topIssues = [
    { issue: 'Password Reset', count: 28, trend: 'up' },
    { issue: 'Software Installation', count: 22, trend: 'down' },
    { issue: 'Hardware Issues', count: 18, trend: 'up' },
    { issue: 'Email Problems', count: 15, trend: 'stable' },
    { issue: 'VPN Access', count: 12, trend: 'up' },
  ];

  const stats = [
    {
      title: 'Total Tickets',
      value: 1247,
      change: '+12%',
      trend: 'up',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Active Users',
      value: 342,
      change: '+5%',
      trend: 'up',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Avg Response Time',
      value: '2.4h',
      change: '-15%',
      trend: 'down',
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      title: 'Escalated',
      value: 8,
      change: '+3',
      trend: 'up',
      icon: AlertTriangle,
      color: 'text-red-600'
    },
  ];

  return (
    <Layout userRole="superAdmin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">Monitor helpdesk performance and trends</p>
          </div>
          
          <Select defaultValue="7days">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <div className="flex items-center mt-1">
                      {stat.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Tickets by Department</CardTitle>
              <CardDescription>Current month breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="resolved" fill="#10B981" name="Resolved" />
                  <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Priority Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Priority Distribution</CardTitle>
              <CardDescription>Current ticket priorities</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Trends</CardTitle>
            <CardDescription>Tickets submitted vs resolved over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="tickets" stroke="#3B82F6" name="Submitted" strokeWidth={2} />
                <Line type="monotone" dataKey="resolved" stroke="#10B981" name="Resolved" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Repetitive Issues */}
        <Card>
          <CardHeader>
            <CardTitle>Top Repetitive Issues</CardTitle>
            <CardDescription>Most common ticket types this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topIssues.map((issue, index) => (
                <div key={issue.issue} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-300">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium">{issue.issue}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{issue.count} occurrences</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {issue.trend === 'up' && <TrendingUp className="h-4 w-4 text-red-500" />}
                    {issue.trend === 'down' && <TrendingDown className="h-4 w-4 text-green-500" />}
                    {issue.trend === 'stable' && <div className="h-4 w-4 bg-gray-400 rounded-full" />}
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

export default AdminAnalytics;
