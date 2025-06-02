import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth.tsx';
import { useEffect, useState } from 'react';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add a small delay to ensure auth state is properly initialized
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Increased delay to ensure auth state is properly initialized

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    // Redirect to login page but save the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute; 