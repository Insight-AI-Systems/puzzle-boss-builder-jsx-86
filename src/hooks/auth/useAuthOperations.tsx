
import React from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AuthOperationsProps {
  lastAuthAttempt: number;
  setLastAuthAttempt: React.Dispatch<React.SetStateAction<number>>;
  MIN_TIME_BETWEEN_AUTH_ATTEMPTS: number;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
  toast: any;
  fetchUserRoles: (userId: string) => Promise<void>;
}

export function useAuthOperations({
  lastAuthAttempt,
  setLastAuthAttempt,
  MIN_TIME_BETWEEN_AUTH_ATTEMPTS,
  setError,
  toast,
  fetchUserRoles
}: AuthOperationsProps) {
  
  // Sign in with email and password
  const signIn = async (email: string, password: string, options?: { rememberMe?: boolean }) => {
    try {
      // Rate limiting check
      const now = Date.now();
      if (now - lastAuthAttempt < MIN_TIME_BETWEEN_AUTH_ATTEMPTS) {
        setError(new Error('Please wait before trying again'));
        toast({
          title: 'Rate limited',
          description: 'Please wait a moment before trying again.',
          variant: 'destructive',
        });
        return;
      }
      
      setLastAuthAttempt(now);
      
      // Attempt sign in
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error('Sign in error:', error);
        setError(error);
        toast({
          title: 'Authentication failed',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }
      
      console.log('Sign in successful:', data);
      
      // Clear any previous errors
      setError(null);
      
      if (data.user) {
        // Fetch user role
        await fetchUserRoles(data.user.id);
        
        // Success toast
        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in.',
        });
      }
    } catch (error) {
      console.error('Exception during sign in:', error);
      setError(error as Error);
      toast({
        title: 'Authentication error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Sign up with email and password
  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    try {
      // Rate limiting check
      const now = Date.now();
      if (now - lastAuthAttempt < MIN_TIME_BETWEEN_AUTH_ATTEMPTS) {
        setError(new Error('Please wait before trying again'));
        toast({
          title: 'Rate limited',
          description: 'Please wait a moment before trying again.',
          variant: 'destructive',
        });
        return;
      }
      
      setLastAuthAttempt(now);
      
      // Attempt sign up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...metadata,
            display_name: metadata?.username || email.split('@')[0],
          },
        },
      });
      
      if (error) {
        console.error('Sign up error:', error);
        setError(error);
        toast({
          title: 'Registration failed',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }
      
      console.log('Sign up successful:', data);
      
      // Clear any previous errors
      setError(null);
      
      // Check if email confirmation is required
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        toast({
          title: 'Account already exists',
          description: 'This email address is already registered. Please sign in.',
        });
        return;
      }
      
      if (data.user && !data.session) {
        toast({
          title: 'Verification required',
          description: 'Please check your email to verify your account.',
        });
      } else if (data.user) {
        // If auto-confirmed (development mode), fetch user role
        await fetchUserRoles(data.user.id);
        
        toast({
          title: 'Welcome!',
          description: 'Your account has been created successfully.',
        });
      }
    } catch (error) {
      console.error('Exception during sign up:', error);
      setError(error as Error);
      toast({
        title: 'Registration error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        setError(error);
        toast({
          title: 'Sign out failed',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }
      
      // Clear any previous errors
      setError(null);
      
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
    } catch (error) {
      console.error('Exception during sign out:', error);
      setError(error as Error);
      toast({
        title: 'Sign out error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Reset password request
  const resetPassword = async (email: string) => {
    try {
      // Rate limiting check
      const now = Date.now();
      if (now - lastAuthAttempt < MIN_TIME_BETWEEN_AUTH_ATTEMPTS) {
        setError(new Error('Please wait before trying again'));
        toast({
          title: 'Rate limited',
          description: 'Please wait a moment before trying again.',
          variant: 'destructive',
        });
        return;
      }
      
      setLastAuthAttempt(now);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });
      
      if (error) {
        console.error('Password reset request error:', error);
        setError(error);
        toast({
          title: 'Password reset failed',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }
      
      // Clear any previous errors
      setError(null);
      
      toast({
        title: 'Password reset email sent',
        description: 'Check your email for the password reset link.',
      });
    } catch (error) {
      console.error('Exception during password reset request:', error);
      setError(error as Error);
      toast({
        title: 'Password reset error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Update password after reset
  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) {
        console.error('Password update error:', error);
        setError(error);
        toast({
          title: 'Password update failed',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }
      
      // Clear any previous errors
      setError(null);
      
      toast({
        title: 'Password updated',
        description: 'Your password has been updated successfully.',
      });
    } catch (error) {
      console.error('Exception during password update:', error);
      setError(error as Error);
      toast({
        title: 'Password update error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Refresh session
  const refreshSession = async () => {
    try {
      const { error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Session refresh error:', error);
        setError(error);
        return;
      }
      
      // Clear any previous errors
      setError(null);
    } catch (error) {
      console.error('Exception during session refresh:', error);
      setError(error as Error);
    }
  };
  
  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshSession
  };
}
