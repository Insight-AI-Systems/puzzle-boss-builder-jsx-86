
import React, { useEffect } from 'react';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuthState } from '@/contexts/auth/AuthStateContext';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const Auth = () => {
  const { isAuthenticated, isLoading, error } = useAuthState();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  
  // Get the intended destination from location state, or default to home
  const from = location.state?.from?.pathname || '/';
  
  // Detect verification and recovery flows
  const isInVerificationFlow = searchParams.get('verificationSuccess') === 'true';
  const isInPasswordRecovery = searchParams.get('type') === 'recovery';
  
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
  }, [error]);
  
  // Show success toast when email is verified
  useEffect(() => {
    if (isInVerificationFlow) {
      toast({
        title: 'Email Verified',
        description: 'Your email has been successfully verified. Please log in with your credentials.',
      });
    }
  }, [isInVerificationFlow]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-puzzle-black flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
      </div>
    );
  }

  // Redirect if already authenticated and not in recovery mode
  if (isAuthenticated && !isInPasswordRecovery && !isInVerificationFlow) {
    return <Navigate to={from} replace />;
  }

  // Force the login view after verification
  const defaultView = isInVerificationFlow ? 'signin' : searchParams.get('signup') === 'true' ? 'signup' : 'signin';

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
            {isInVerificationFlow 
              ? 'Please log in with your verified email'
              : searchParams.get('signup') === 'true' 
                ? 'Create an account to start playing' 
                : 'Sign in to continue to your account'}
          </p>
        </div>
        <AuthForm initialView={defaultView as any} />
      </div>
    </div>
  );
};

export default Auth;
