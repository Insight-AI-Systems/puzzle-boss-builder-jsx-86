
import React, { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuthState } from '@/hooks/auth/useAuthState';
import Navbar from '@/components/Navbar';
import { Skeleton } from '@/components/ui/skeleton';

const Auth = () => {
  const { currentUserId, isLoading } = useAuthState();
  const [searchParams] = useSearchParams();
  const [defaultTab, setDefaultTab] = useState<'signin' | 'signup'>('signin');
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'signup') {
      setDefaultTab('signup');
    }
    
    // Add a short delay to ensure content renders even if there's an issue with auth state
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchParams]);
  
  // Redirect to home if already authenticated
  if (currentUserId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-puzzle-black">
      <Navbar />
      <div className="container mx-auto flex items-center justify-center py-12 px-4">
        {isLoading && !showContent ? (
          <div className="w-full max-w-md space-y-8">
            <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default Auth;
