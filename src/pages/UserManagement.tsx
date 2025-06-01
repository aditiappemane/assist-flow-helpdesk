
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, Edit, Trash2, Download, Upload, Users, Shield, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const users = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@company.com',
      role: 'agent',
      department: 'IT',
      status: 'active',
      lastLogin: '2024-01-15 10:30 AM',
      ticketsAssigned: 12
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'agent',
      department: 'HR',
      status: 'active',
      lastLogin: '2024-01-15 09:15 AM',
      ticketsAssigned: 8
    },
    {
      id: 3,
      name: 'Mike Davis',
      email: 'mike.davis@company.com',
      role: 'agent',
      department: 'Admin',
      status: 'active',
      lastLogin: '2024-01-14 04:45 PM',
      ticketsAssigned: 15
    },
    {
      id: 4,
      name: 'Emily Chen',
      email: 'emily.chen@company.com',
      role: 'employee',
      department: 'Marketing',
      status: 'active',
      lastLogin: '2024-01-15 11:20 AM',
      ticketsAssigned: 0
    },
    {
      id: 5,
      name: 'Robert Wilson',
      email: 'robert.wilson@company.com',
      role: 'employee',
      department: 'Sales',
      status: 'inactive',
      lastLogin: '2024-01-10 02:30 PM',
      ticketsAssigned: 0
    }
  ];

  const stats = [
    { title: 'Total Users', value: 342, icon: Users, color: 'text-blue-600' },
    { title: 'Agents', value: 28, icon: Shield, color: 'text-green-600' },
    { title: 'Employees', value: 314, icon: User, color: 'text-purple-600' },
    { title: 'Active Today', value: 187, icon: Users, color: 'text-orange-600' },
  ];

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      'superAdmin': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'agent': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'employee': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    return roleConfig[role as keyof typeof roleConfig] || roleConfig['employee'];
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesDepartment = departmentFilter === 'all' || user.department === departmentFilter;
    
    return matchesSearch && matchesRole && matchesDepartment;
  });

  const handleCreateUser = () => {
    toast({
      title: "User Created",
      description: "New user has been successfully created.",
    });
    setIsCreateDialogOpen(false);
  };

  const handleBulkImport = () => {
    toast({
      title: "Import Started",
      description: "Bulk user import is being processed.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "User data export is being prepared.",
    });
  };

  return (
    <Layout userRole="superAdmin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage users, roles, and departments</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={handleBulkImport}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>
                    Add a new user to the system with appropriate role and department.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john.doe@company.com" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employee">Employee</SelectItem>
                          <SelectItem value="agent">Agent</SelectItem>
                          <SelectItem value="superAdmin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IT">IT</SelectItem>
                          <SelectItem value="HR">HR</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleCreateUser} className="flex-1">Create User</Button>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search users by name or email..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="superAdmin">Super Admin</SelectItem>
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage all system users and their permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="font-medium text-blue-600 dark:text-blue-300">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-medium">{user.name}</h4>
                          <Badge className={getRoleBadge(user.role)}>
                            {user.role}
                          </Badge>
                          <Badge className={getStatusBadge(user.status)}>
                            {user.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                          <span>{user.email}</span>
                          <span>Department: {user.department}</span>
                          <span>Last login: {user.lastLogin}</span>
                          {user.role === 'agent' && (
                            <span>Tickets: {user.ticketsAssigned}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
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

export default UserManagement;
