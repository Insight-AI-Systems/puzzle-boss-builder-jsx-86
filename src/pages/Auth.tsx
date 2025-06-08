
import React, { useEffect } from 'react';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { AuthForm } from '@/components/auth/AuthForm';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const Auth = () => {
  const { isSignedIn, isLoaded } = useUser();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get the intended destination from location state, or default to home
  const from = location.state?.from?.pathname || '/';
  
  // Show loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-puzzle-black flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
      </div>
    );
  }

  // Redirect if already authenticated
  if (isSignedIn) {
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
            {searchParams.get('signup') === 'true' 
              ? 'Create an account to start playing' 
              : 'Sign in to continue to your account'}
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
};

export default Auth;
