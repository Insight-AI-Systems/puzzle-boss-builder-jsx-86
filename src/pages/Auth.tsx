
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Loader2 } from 'lucide-react';

const Auth = () => {
  const { currentUserId, isLoading } = useUserProfile();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Add a small delay to ensure components are fully loaded
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Redirect to home if already authenticated
  useEffect(() => {
    if (currentUserId && !isLoading) {
      navigate('/', { replace: true });
    }
  }, [currentUserId, isLoading, navigate]);

  if (isPageLoading || isLoading) {
    return (
      <div className="min-h-screen bg-puzzle-black flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
      </div>
    );
  }

  if (currentUserId) {
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
