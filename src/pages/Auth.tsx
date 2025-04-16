
import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { useUserProfile } from '@/hooks/useUserProfile';

const Auth = () => {
  const { currentUserId } = useUserProfile();
  
  // Redirect to home if already authenticated
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
