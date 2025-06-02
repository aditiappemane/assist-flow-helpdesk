import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth.tsx';

const DEPARTMENTS = ['IT', 'HR', 'Admin'] as const;
type Department = typeof DEPARTMENTS[number];

type Role = 'user' | 'agent' | 'admin';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('user');
  const [department, setDepartment] = useState<Department>('IT');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return false;
    }

    if (!email.includes('@')) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return false;
    }

    if (role === 'agent' && !department) {
      toast({
        title: "Error",
        description: "Please select a department for agent login",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      console.log('Attempting login with:', { email, role, department });
      await login(email, password);
      
      // Get user info from localStorage since it's set by the auth context
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

      toast({
        title: "Login Successful",
        description: `Welcome back, ${userInfo.name}!`,
      });

      // Use navigate without window.location
      if (userInfo.role === 'agent') {
        navigate('/agent-dashboard', { replace: true });
      } else if (userInfo.role === 'admin') {
        navigate('/admin/analytics', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.error || "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-3xl font-bold text-blue-600">AssistFlow</h1>
          </div>
          <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your helpdesk account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className={isLoading ? 'opacity-50' : ''}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className={isLoading ? 'opacity-50' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Login as</Label>
              <Select 
                value={role} 
                onValueChange={(value: Role) => setRole(value)} 
                disabled={isLoading}
              >
                <SelectTrigger className={isLoading ? 'opacity-50' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Employee</SelectItem>
                  <SelectItem value="agent">Support Agent</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {role === 'agent' && (
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select 
                  value={department} 
                  onValueChange={(value: Department) => setDepartment(value)} 
                  disabled={isLoading}
                >
                  <SelectTrigger className={isLoading ? 'opacity-50' : ''}>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
