
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuthState } from '@/hooks/auth/useAuthState';
import { Loader2 } from 'lucide-react';

const Auth = () => {
  const { currentUserId, isLoading } = useAuthState();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // If we're in password recovery flow, we don't want to redirect
  const isPasswordRecovery = searchParams.get('type') === 'recovery';
  
  useEffect(() => {
    // Shorter delay to ensure components load without too long a wait
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  // Redirect to home if already authenticated and not in recovery flow
  useEffect(() => {
    if (currentUserId && !isLoading && !isPasswordRecovery) {
      navigate('/', { replace: true });
    }
  }, [currentUserId, isLoading, navigate, isPasswordRecovery]);

  // Show loading indicator only initially and for a very short time
  if (isPageLoading && isLoading) {
    return (
      <div className="min-h-screen bg-puzzle-black flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
      </div>
    );
  }

  // Allow password recovery flow to proceed even if authenticated
  if (currentUserId && !isPasswordRecovery) {
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
