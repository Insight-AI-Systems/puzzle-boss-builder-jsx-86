
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/userTypes';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  userRoles: string[];
  isAdmin: boolean;
  rolesLoaded: boolean;
  error: AuthError | Error | null;
  clearAuthError: () => void;
  hasRole: (role: string) => boolean;
  signIn: (email: string, password: string, options?: { rememberMe?: boolean }) => Promise<void>;
  signUp: (email: string, password: string, metadata?: { username?: string; acceptTerms?: boolean }) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOADING_TIMEOUT = 10000; // 10 seconds max loading time
const AUTH_RETRY_DELAY = 2000; // 2 seconds between retries

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [rolesLoaded, setRolesLoaded] = useState(false);
  const [error, setError] = useState<AuthError | Error | null>(null);
  const [lastAuthAttempt, setLastAuthAttempt] = useState<number>(0);
  const { toast } = useToast();

  const MIN_TIME_BETWEEN_AUTH_ATTEMPTS = 2000;

  // Force loading to stop after timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('Auth loading timeout reached, forcing completion');
        setIsLoading(false);
        setRolesLoaded(true);
      }
    }, LOADING_TIMEOUT);

    return () => clearTimeout(timeout);
  }, [isLoading]);

  const clearAuthError = () => setError(null);

  const fetchUserRole = async (userId: string, retryCount = 0): Promise<UserRole> => {
    try {
      // Special case for super admin email
      if (session?.user?.email === 'alan@insight-ai-systems.com') {
        return 'super_admin';
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          // No profile found, default to player
          return 'player';
        }
        throw profileError;
      }

      return (profile?.role as UserRole) || 'player';
    } catch (err) {
      console.error('Error fetching user role:', err);
      
      // Retry once on failure
      if (retryCount < 1) {
        await new Promise(resolve => setTimeout(resolve, AUTH_RETRY_DELAY));
        return fetchUserRole(userId, retryCount + 1);
      }
      
      // Default to player on persistent failure
      return 'player';
    }
  };

  const handleAuthStateChange = async (event: string, newSession: Session | null) => {
    console.log('Auth state change:', event, !!newSession);
    
    try {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      if (newSession?.user) {
        // Fetch role with timeout protection
        const rolePromise = fetchUserRole(newSession.user.id);
        const timeoutPromise = new Promise<UserRole>((resolve) => {
          setTimeout(() => resolve('player'), 5000); // 5 second timeout for role fetch
        });
        
        const role = await Promise.race([rolePromise, timeoutPromise]);
        setUserRole(role);
        setUserRoles([role]);
        setRolesLoaded(true);
      } else {
        setUserRole(null);
        setUserRoles([]);
        setRolesLoaded(true);
      }
    } catch (err) {
      console.error('Error in auth state change:', err);
      setError(err as Error);
      // Don't block loading on errors
      setUserRole('player');
      setUserRoles(['player']);
      setRolesLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string, options?: { rememberMe?: boolean }) => {
    try {
      // Rate limiting check
      const now = Date.now();
      if (now - lastAuthAttempt < MIN_TIME_BETWEEN_AUTH_ATTEMPTS) {
        const errorMsg = 'Please wait before trying again';
        setError(new Error(errorMsg));
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
      
      // Success toast
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });
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
  const signUp = async (email: string, password: string, metadata?: { username?: string; acceptTerms?: boolean }) => {
    try {
      // Rate limiting check
      const now = Date.now();
      if (now - lastAuthAttempt < MIN_TIME_BETWEEN_AUTH_ATTEMPTS) {
        const errorMsg = 'Please wait before trying again';
        setError(new Error(errorMsg));
        toast({
          title: 'Rate limited',
          description: 'Please wait a moment before trying again.',
          variant: 'destructive',
        });
        return;
      }
      
      setLastAuthAttempt(now);
      
      const redirectUrl = `${window.location.origin}/`;
      
      // Attempt sign up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
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
        const errorMsg = 'Please wait before trying again';
        setError(new Error(errorMsg));
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

  // Check if user has a specific role
  const hasRole = (role: string): boolean => {
    if (!rolesLoaded || !userRole) return false;
    
    // Direct role match
    if (userRole === role) return true;
    
    // Admin roles have access to lower roles
    if (userRole === 'super_admin') return true;
    if (userRole === 'admin' && role === 'player') return true;
    
    // Check if role exists in userRoles array
    return userRoles.includes(role);
  };

  useEffect(() => {
    console.log('AuthProvider initializing...');
    setIsLoading(true);

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Get initial session with timeout protection
    const initializeAuth = async () => {
      try {
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise<{ data: { session: Session | null } }>((resolve) => {
          setTimeout(() => resolve({ data: { session: null } }), 5000);
        });

        const { data: { session: initialSession } } = await Promise.race([sessionPromise, timeoutPromise]);
        
        if (initialSession) {
          await handleAuthStateChange('INITIAL_SESSION', initialSession);
        } else {
          setIsLoading(false);
          setRolesLoaded(true);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError(err as Error);
        setIsLoading(false);
        setRolesLoaded(true);
      }
    };

    initializeAuth();

    return () => {
      console.log('AuthProvider cleanup');
      subscription.unsubscribe();
    };
  }, []);

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      console.error('Auth error:', error);
      toast({
        title: 'Authentication Error',
        description: 'There was a problem with authentication. Some features may not work properly.',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const isAuthenticated = !!user && !!session;
  const isAdmin = userRole === 'super_admin' || userRole === 'admin';

  console.log('AuthProvider state:', {
    isLoading,
    isAuthenticated,
    userRole,
    hasUser: !!user,
    hasSession: !!session,
    rolesLoaded
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated,
        userRole,
        userRoles,
        isAdmin,
        rolesLoaded,
        error,
        clearAuthError,
        hasRole,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthContext, type AuthContextType };
