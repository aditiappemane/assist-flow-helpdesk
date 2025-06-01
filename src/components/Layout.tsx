
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  User, 
  Settings, 
  Sun, 
  Moon, 
  Home, 
  Plus, 
  FileText, 
  MessageSquare,
  BarChart3,
  Users,
  Brain,
  LogOut
} from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LayoutProps {
  children: React.ReactNode;
  userRole?: 'employee' | 'agent' | 'superAdmin';
}

const Layout = ({ children, userRole = 'employee' }: LayoutProps) => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const employeeNavItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Plus, label: 'Submit Ticket', path: '/submit-ticket' },
    { icon: FileText, label: 'My Tickets', path: '/my-tickets' },
    { icon: MessageSquare, label: 'Ask Bot', path: '/ask-bot' },
  ];

  const agentNavItems = [
    { icon: Home, label: 'Agent Dashboard', path: '/agent-dashboard' },
    { icon: FileText, label: 'All Tickets', path: '/agent-dashboard' },
    { icon: MessageSquare, label: 'Ask Bot', path: '/ask-bot' },
  ];

  const adminNavItems = [
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: FileText, label: 'All Tickets', path: '/agent-dashboard' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
    { icon: Brain, label: 'AI Management', path: '/admin/ai' },
  ];

  const getNavItems = () => {
    switch (userRole) {
      case 'agent':
        return agentNavItems;
      case 'superAdmin':
        return adminNavItems;
      default:
        return employeeNavItems;
    }
  };

  const getRoleDisplay = () => {
    switch (userRole) {
      case 'agent':
        return 'Support Agent';
      case 'superAdmin':
        return 'Super Admin';
      default:
        return 'Employee';
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                AssistFlow
              </h1>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {getRoleDisplay()}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-[calc(100vh-73px)]">
          <nav className="p-4">
            <div className="space-y-2">
              {getNavItems().map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
