
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
  signIn: (email: string, password: string, options?: { rememberMe?: boolean }) => Promise<void>;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  
  // Helper methods
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasRole: (role: string) => boolean;
  
  // Security methods
  clearAuthError: () => void;
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
  const [lastAuthAttempt, setLastAuthAttempt] = useState<number>(0);

  // Hooks
  const { toast } = useToast();
  const navigate = useNavigate();

  // Security constants
  const MIN_TIME_BETWEEN_AUTH_ATTEMPTS = 2000; // 2 seconds, to prevent brute force

  // Computed properties
  const isAuthenticated = useMemo(() => !!user && !!session, [user, session]);
  const isAdmin = useMemo(() => userRoles.includes('admin') || userRoles.includes('super_admin'), [userRoles]);

  // Function to clear auth errors
  const clearAuthError = () => setError(null);

  // Function to fetch user roles
  const fetchUserRoles = async (userId: string) => {
    try {
      // First check if the user role is stored in the profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching user profile:', profileError);
        return;
      }

      if (profile && profile.role) {
        setUserRoles([profile.role]);
        return;
      }

      // If no profile role, check user_roles table
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        return;
      }

      if (roles && roles.length > 0) {
        // Extract role strings from the array of role objects
        const extractedRoles = roles.map(roleObj => roleObj.role);
        setUserRoles(extractedRoles);
      } else {
        // Default to empty array if no roles found
        setUserRoles([]);
      }
    } catch (error) {
      console.error('Error fetching user roles:', error);
      // Default to empty array if error
      setUserRoles([]);
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
      
      // Special handling for certain events
      if (event === 'SIGNED_OUT') {
        // Clear any cached user data
        setUserRoles([]);
        
        // Note: We don't navigate here because onAuthStateChange
        // fires during initial page load, which would cause
        // unwanted redirects
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

  // Security function: Rate limiting for auth attempts
  const checkRateLimit = (): boolean => {
    const now = Date.now();
    if (now - lastAuthAttempt < MIN_TIME_BETWEEN_AUTH_ATTEMPTS) {
      setError(new Error('Too many auth attempts. Please wait before trying again.'));
      return false;
    }
    setLastAuthAttempt(now);
    return true;
  };

  /**
   * Sign in with email and password
   * Includes rate limiting and security logging
   */
  const signIn = async (email: string, password: string, options?: { rememberMe?: boolean }) => {
    // Prevent rapid fire auth attempts (rate limiting)
    if (!checkRateLimit()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password,
        options: {
          // Use session persistence based on remember me setting  
          persistSession: options?.rememberMe !== false
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Log successful login for security monitoring
      console.info('Auth successful:', {
        timestamp: new Date().toISOString(),
        userId: data.user?.id,
        email: email.substring(0, 3) + '***', // Log partial email for security
        success: true
      });
      
      toast({
        title: 'Welcome back!',
        description: 'Successfully signed in.',
      });
      
      // Redirect is handled by onAuthStateChange
    } catch (e) {
      console.error('Sign in error:', e);
      setError(e instanceof Error ? e : new Error('Unknown sign in error'));
      
      // Log failed attempt (for security monitoring)
      console.warn('Failed auth attempt:', {
        timestamp: new Date().toISOString(),
        email: email.substring(0, 3) + '***', // Log partial email for security
        success: false,
        error: e instanceof Error ? e.message : 'Unknown error'
      });
      
      toast({
        title: 'Authentication failed',
        description: 'Invalid email or password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign up with email and password
   * Includes security validations
   */
  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    // Prevent rapid fire auth attempts
    if (!checkRateLimit()) return;

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
          data: userMetadata,
          emailRedirectTo: `${window.location.origin}/auth?verificationSuccess=true`
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Check if email confirmation is required
      const requiresConfirmation = !data.session;
      
      // Show appropriate toast
      toast({
        title: 'Account created!',
        description: requiresConfirmation 
          ? 'Please check your email to verify your account.' 
          : 'Your account has been created successfully.',
      });

      // If email confirmation is required, navigate to verification page
      if (requiresConfirmation) {
        navigate('/auth?view=verification-pending', { replace: true });
      }
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
   * Includes session cleanup
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
        title: 'Signed out',
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
   * Includes rate limiting and timing attack prevention
   */
  const resetPassword = async (email: string) => {
    // Prevent rapid fire auth attempts
    if (!checkRateLimit()) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const startTime = Date.now();
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });
      
      if (error) {
        throw error;
      }
      
      // Prevent timing attacks by ensuring minimum processing time
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000 - elapsedTime));
      }
      
      // Always show success message whether email exists or not (prevent user enumeration)
      toast({
        title: 'Password reset email sent',
        description: 'If an account with this email exists, you will receive password reset instructions.',
      });
      
      // Redirect to verification pending page
      navigate('/auth?view=verification-pending', { replace: true });
    } catch (e) {
      console.error('Password reset error:', e);
      setError(e instanceof Error ? e : new Error('Unknown password reset error'));
      
      // Ensure same response time even on error (prevent timing attacks)
      const elapsedTime = Date.now() - lastAuthAttempt;
      if (elapsedTime < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000 - elapsedTime));
      }
      
      // Still show success message to prevent user enumeration
      toast({
        title: 'Password reset email sent',
        description: 'If an account with this email exists, you will receive password reset instructions.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update user password (after reset)
   * Includes validation and notification
   */
  const updatePassword = async (password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Validate password strength
      if (!password || password.length < 8) {
        setError(new Error('Password must be at least 8 characters'));
        return;
      }
      
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
   * Used for role-based access control
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
    hasRole,
    clearAuthError
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
