
import React, { createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthError } from '@supabase/supabase-js';
import { useAuthState } from './AuthStateContext';
import { toast } from '@/hooks/use-toast';
import { handleAuthError } from '@/utils/auth/authErrorHandler';

interface AuthOperationsContextType {
  signIn: (email: string, password: string, options?: { rememberMe?: boolean }) => Promise<void>;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthOperationsContext = createContext<AuthOperationsContextType | undefined>(undefined);

// Minimum time between auth attempts to prevent abuse
const MIN_TIME_BETWEEN_AUTH_ATTEMPTS = 2000;

export function AuthOperationsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthState();
  let lastAuthAttempt = 0;

  // Sign in a user with email and password
  const signIn = async (email: string, password: string, options?: { rememberMe?: boolean }) => {
    try {
      // Rate limiting
      const now = Date.now();
      if (now - lastAuthAttempt < MIN_TIME_BETWEEN_AUTH_ATTEMPTS) {
        toast({
          title: "Too many attempts",
          description: "Please wait a moment before trying again",
          variant: "destructive",
        });
        return;
      }
      
      lastAuthAttempt = now;
      
      // Sign in with Supabase
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          // Set session duration based on remember me option
          expiresIn: options?.rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 24,
        },
      });
      
      if (error) {
        throw error;
      }
      
      // Success message
      toast({
        title: "Signed in",
        description: "You have been signed in successfully",
      });
      
      // Update the last_sign_in time in the database
      if (user) {
        try {
          await supabase.functions.invoke('handle_user_signin', {
            body: { userId: user.id }
          });
        } catch (error) {
          console.error('Error updating last sign in time:', error);
        }
      }
    } catch (error) {
      console.error('Sign in error:', error);
      handleAuthError(error as AuthError, (message) => {
        toast({
          title: "Sign in failed",
          description: message,
          variant: "destructive",
        });
      });
    }
  };

  // Sign up a new user
  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    try {
      // Rate limiting
      const now = Date.now();
      if (now - lastAuthAttempt < MIN_TIME_BETWEEN_AUTH_ATTEMPTS) {
        toast({
          title: "Too many attempts",
          description: "Please wait a moment before trying again",
          variant: "destructive",
        });
        return;
      }
      
      lastAuthAttempt = now;
      
      // Sign up with Supabase
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      
      if (error) {
        throw error;
      }
      
      // Success message
      toast({
        title: "Account created",
        description: "Please verify your email to complete registration",
      });
    } catch (error) {
      console.error('Sign up error:', error);
      handleAuthError(error as AuthError, (message) => {
        toast({
          title: "Sign up failed",
          description: message,
          variant: "destructive",
        });
      });
    }
  };

  // Sign out the current user
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign out failed",
        description: "There was a problem signing you out",
        variant: "destructive",
      });
    }
  };

  // Request a password reset for an email
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for a password reset link",
      });
    } catch (error) {
      console.error('Password reset error:', error);
      handleAuthError(error as AuthError, (message) => {
        toast({
          title: "Password reset failed",
          description: message,
          variant: "destructive",
        });
      });
    }
  };

  // Update the current user's password
  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully",
      });
    } catch (error) {
      console.error('Update password error:', error);
      handleAuthError(error as AuthError, (message) => {
        toast({
          title: "Password update failed",
          description: message,
          variant: "destructive",
        });
      });
    }
  };

  // Refresh the current session
  const refreshSession = async () => {
    try {
      const { error } = await supabase.auth.refreshSession();
      
      if (error) {
        throw error;
      }
      
      console.log('Session refreshed successfully');
    } catch (error) {
      console.error('Session refresh error:', error);
      
      // Only show a toast for certain errors that indicate session problems
      if ((error as AuthError).status === 401) {
        toast({
          title: "Session expired",
          description: "Your session has expired. Please sign in again.",
          variant: "destructive",
        });
      }
    }
  };

  const value = {
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
