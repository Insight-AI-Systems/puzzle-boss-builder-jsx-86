
import React, { useEffect } from 'react';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const Auth = () => {
  const { isAuthenticated, isLoading, error } = useAuth();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get the intended destination from location state, or default to home
  const from = location.state?.from?.pathname || '/';
  
  // If we're in password recovery flow, we don't want to redirect
  const isPasswordRecovery = searchParams.get('type') === 'recovery';
  
  // Handle authentication errors
  useEffect(() => {
    if (error) {
      console.error('Auth error:', error);
      toast({
        title: 'Authentication Error',
        description: 'There was a problem with authentication. Please try again.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-puzzle-black flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
      </div>
    );
  }

  // Redirect if already authenticated and not in recovery mode
  if (isAuthenticated && !isPasswordRecovery) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen bg-puzzle-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-puzzle-white">
            Welcome to <span className="text-puzzle-aqua">The</span>{' '}
            <span className="text-puzzle-white">Puzzle</span>{' '}
            <span className="text-puzzle-gold">Boss</span>
          </h2>
          <p className="mt-2 text-muted-foreground">
            Sign in or create an account to start playing
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
};

export default Auth;
