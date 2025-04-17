
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuthState } from '@/hooks/auth/useAuthState';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const { currentUserId, isLoading: authLoading, error: authError } = useAuthState();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  // If we're in password recovery flow, we don't want to redirect
  const isPasswordRecovery = searchParams.get('type') === 'recovery';
  
  // Add safety timeout to prevent infinite loading
  useEffect(() => {
    // Set a short timeout for initial page load
    const pageTimer = setTimeout(() => {
      setIsPageLoading(false);
    }, 100); // Shorter timeout for faster rendering

    // Set a longer safety timeout to prevent infinite loading
    const safetyTimer = setTimeout(() => {
      setLoadingTimeout(true);
      console.log('Safety timeout triggered - forcing auth page to render');
    }, 1500); // Shorter timeout to prevent long "wheel of death"

    return () => {
      clearTimeout(pageTimer);
      clearTimeout(safetyTimer);
    };
  }, []);

  // Handle authentication errors
  useEffect(() => {
    if (authError) {
      console.error('Auth error:', authError);
      toast({
        title: 'Authentication Error',
        description: 'There was a problem loading authentication state. Please try again.',
        variant: 'destructive',
      });
    }
  }, [authError, toast]);

  // Force render the auth form if we've been loading too long
  if (loadingTimeout) {
    console.log('Rendering auth form due to timeout');
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
  }

  // Show loading indicator only initially and for a very short time
  if (isPageLoading && authLoading) {
    return (
      <div className="min-h-screen bg-puzzle-black flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
      </div>
    );
  }

  // Handle redirection only if not in recovery mode and we're not loading
  if (!isPasswordRecovery && currentUserId && !authLoading) {
    console.log('User authenticated, redirecting to home');
    return <Navigate to="/" replace />;
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
