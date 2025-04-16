
import React, { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuthState } from '@/hooks/auth/useAuthState';
import Navbar from '@/components/Navbar';

const Auth = () => {
  const { currentUserId, isLoading } = useAuthState();
  const [searchParams] = useSearchParams();
  const [defaultTab, setDefaultTab] = useState<'signin' | 'signup'>('signin');
  
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'signup') {
      setDefaultTab('signup');
    }
  }, [searchParams]);
  
  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-puzzle-black flex items-center justify-center p-4">
        <div className="animate-spin h-8 w-8 border-4 border-puzzle-aqua rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  // Redirect to home if already authenticated
  if (currentUserId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-puzzle-black">
      <Navbar />
      <div className="container mx-auto flex items-center justify-center py-12 px-4">
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
          <AuthForm defaultTab={defaultTab} />
        </div>
      </div>
    </div>
  );
};

export default Auth;
