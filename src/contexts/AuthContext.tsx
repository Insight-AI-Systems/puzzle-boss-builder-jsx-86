
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

// Define the context shape
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: AuthError | Error | null;
  
  // Auth methods
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  
  // Helper methods
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasRole: (role: string) => boolean;
}

// Create context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props type
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider - The global authentication provider component
 * Handles auth state, session management, and provides auth methods
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // State management
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | Error | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  // Hooks
  const { toast } = useToast();
  const navigate = useNavigate();

  // Computed properties
  const isAuthenticated = useMemo(() => !!user && !!session, [user, session]);
  const isAdmin = useMemo(() => userRoles.includes('admin') || userRoles.includes('super_admin'), [userRoles]);

  // Function to fetch user roles
  const fetchUserRoles = async (userId: string) => {
    try {
      // First check if the user role is stored in the profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        return;
      }

      if (profile && profile.role) {
        setUserRoles([profile.role]);
      }
    } catch (error) {
      console.error('Error fetching user roles:', error);
    }
  };

  // Initialize auth state
  useEffect(() => {
    // CRITICAL: Set up auth state listener FIRST to prevent missing events
    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('Auth state changed:', event);
      
      // Handle the auth state change
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      // Fetch roles if user is authenticated
      // IMPORTANT: Use setTimeout to prevent Supabase auth deadlock
      if (newSession?.user) {
        setTimeout(() => {
          fetchUserRoles(newSession.user.id);
        }, 0);
      } else {
        setUserRoles([]);
      }
      
      setIsLoading(false);
    });

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        // Fetch roles if user is authenticated
        if (data.session?.user) {
          await fetchUserRoles(data.session.user.id);
        }
      } catch (e) {
        console.error('Error initializing auth:', e);
        setError(e instanceof Error ? e : new Error('Unknown auth error'));
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
    
    // Cleanup function
    return () => {
      if (authListener && 'subscription' in authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  /**
   * Sign in with email and password
   */
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Welcome back!',
        description: 'Successfully signed in.',
      });
      
      // Redirect is handled by onAuthStateChange
    } catch (e) {
      console.error('Sign in error:', e);
      setError(e instanceof Error ? e : new Error('Unknown sign in error'));
      
      toast({
        title: 'Authentication failed',
        description: e instanceof Error ? e.message : 'Failed to sign in',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign up with email and password
   */
  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Default metadata if none provided
      const userMetadata = metadata || {
        username: email.split('@')[0],
        avatar_url: null,
        bio: null
      };
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userMetadata
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Account created!',
        description: 'Please check your email to verify your account.',
      });
    } catch (e) {
      console.error('Sign up error:', e);
      setError(e instanceof Error ? e : new Error('Unknown sign up error'));
      
      toast({
        title: 'Registration failed',
        description: e instanceof Error ? e.message : 'Failed to create account',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign out current user
   */
  const signOut = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });

      // Navigate to home page
      navigate('/', { replace: true });
    } catch (e) {
      console.error('Sign out error:', e);
      setError(e instanceof Error ? e : new Error('Unknown sign out error'));
      
      toast({
        title: 'Logout failed',
        description: e instanceof Error ? e.message : 'Failed to log out',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Send password reset email
   */
  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Password reset email sent',
        description: 'Please check your email for password reset instructions.',
      });
    } catch (e) {
      console.error('Password reset error:', e);
      setError(e instanceof Error ? e : new Error('Unknown password reset error'));
      
      toast({
        title: 'Password reset failed',
        description: e instanceof Error ? e.message : 'Failed to send reset email',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update user password (after reset)
   */
  const updatePassword = async (password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: 'Password updated',
        description: 'Your password has been updated successfully.',
      });
      
      // Redirect to home after successful password reset
      navigate('/', { replace: true });
    } catch (e) {
      console.error('Update password error:', e);
      setError(e instanceof Error ? e : new Error('Unknown update password error'));
      
      toast({
        title: 'Password update failed',
        description: e instanceof Error ? e.message : 'Failed to update password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Check if user has a specific role
   */
  const hasRole = (role: string): boolean => {
    return userRoles.includes(role);
  };

  // Compile context value
  const value: AuthContextType = {
    user,
    session,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    isAuthenticated,
    isAdmin,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to use the auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
