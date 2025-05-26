
import React, { createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthOperationsContextType {
  signIn: (email: string, password: string, options?: { rememberMe?: boolean }) => Promise<void>;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthOperationsContext = createContext<AuthOperationsContextType | undefined>(undefined);

export function AuthOperationsProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();

  const signIn = async (email: string, password: string, options?: { rememberMe?: boolean }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        toast({
          title: 'Authentication failed',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      console.log('Sign in successful:', data);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });
    } catch (error) {
      console.error('Exception during sign in:', error);
      toast({
        title: 'Authentication error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    try {
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
        toast({
          title: 'Registration failed',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      console.log('Sign up successful:', data);

      if (data.user && !data.session) {
        toast({
          title: 'Verification required',
          description: 'Please check your email to verify your account.',
        });
      } else if (data.user) {
        toast({
          title: 'Welcome!',
          description: 'Your account has been created successfully.',
        });
      }
    } catch (error) {
      console.error('Exception during sign up:', error);
      toast({
        title: 'Registration error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Sign out error:', error);
        toast({
          title: 'Sign out failed',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
    } catch (error) {
      console.error('Exception during sign out:', error);
      toast({
        title: 'Sign out error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });

      if (error) {
        console.error('Password reset request error:', error);
        toast({
          title: 'Password reset failed',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Password reset email sent',
        description: 'Check your email for the password reset link.',
      });
    } catch (error) {
      console.error('Exception during password reset request:', error);
      toast({
        title: 'Password reset error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        console.error('Password update error:', error);
        toast({
          title: 'Password update failed',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Password updated',
        description: 'Your password has been updated successfully.',
      });
    } catch (error) {
      console.error('Exception during password update:', error);
      toast({
        title: 'Password update error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const refreshSession = async () => {
    try {
      const { error } = await supabase.auth.refreshSession();

      if (error) {
        console.error('Session refresh error:', error);
        return;
      }
    } catch (error) {
      console.error('Exception during session refresh:', error);
    }
  };

  const value: AuthOperationsContextType = {
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshSession,
  };

  return (
    <AuthOperationsContext.Provider value={value}>
      {children}
    </AuthOperationsContext.Provider>
  );
}

export function useAuthOperations() {
  const context = useContext(AuthOperationsContext);
  if (context === undefined) {
    throw new Error('useAuthOperations must be used within an AuthOperationsProvider');
  }
  return context;
}
