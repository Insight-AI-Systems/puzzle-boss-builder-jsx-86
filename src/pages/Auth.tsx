
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuthState } from '@/hooks/auth/useAuthState';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const { currentUserId, isLoading: authLoading, error: authError } = useAuthState();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  // If we're in password recovery flow, we don't want to redirect
  const isPasswordRecovery = searchParams.get('type') === 'recovery';
  
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

  // For simplicity, we'll render the auth form immediately - no loading states
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
