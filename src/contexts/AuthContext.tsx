import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: AuthError | Error | null;
  
  signIn: (email: string, password: string, options?: { rememberMe?: boolean }) => Promise<void>;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasRole: (role: string) => boolean;
  
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | Error | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [lastAuthAttempt, setLastAuthAttempt] = useState<number>(0);

  const { toast } = useToast();
  const navigate = useNavigate();

  const MIN_TIME_BETWEEN_AUTH_ATTEMPTS = 2000;

  const isAuthenticated = useMemo(() => !!user && !!session, [user, session]);
  const isAdmin = useMemo(() => userRoles.includes('admin') || userRoles.includes('super_admin'), [userRoles]);

  const clearAuthError = () => setError(null);

  const fetchUserRoles = async (userId: string) => {
    try {
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

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        return;
      }

      if (roles && roles.length > 0) {
        const extractedRoles = roles.map(roleObj => roleObj.role);
        setUserRoles(extractedRoles);
      } else {
        setUserRoles([]);
      }
    } catch (error) {
      console.error('Error fetching user roles:', error);
      setUserRoles([]);
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('Auth state changed:', event);
      
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      if (newSession?.user) {
        setTimeout(() => {
          fetchUserRoles(newSession.user.id);
        }, 0);
      } else {
        setUserRoles([]);
      }
      
      if (event === 'SIGNED_OUT') {
        setUserRoles([]);
      }
      
      setIsLoading(false);
    });

    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
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
    
    return () => {
      if (authListener && 'subscription' in authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const checkRateLimit = (): boolean => {
    const now = Date.now();
    if (now - lastAuthAttempt < MIN_TIME_BETWEEN_AUTH_ATTEMPTS) {
      setError(new Error('Too many auth attempts. Please wait before trying again.'));
      return false;
    }
    setLastAuthAttempt(now);
    return true;
  };

  const signIn = async (email: string, password: string, options?: { rememberMe?: boolean }) => {
    if (!checkRateLimit()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password
      });
      
      if (error) {
        throw error;
      }
      
      console.info('Auth successful:', {
        timestamp: new Date().toISOString(),
        userId: data.user?.id,
        email: email.substring(0, 3) + '***',
        success: true
      });
      
      toast({
        title: 'Welcome back!',
        description: 'Successfully signed in.',
      });
      
    } catch (e) {
      console.error('Sign in error:', e);
      setError(e instanceof Error ? e : new Error('Unknown sign in error'));
      
      console.warn('Failed auth attempt:', {
        timestamp: new Date().toISOString(),
        email: email.substring(0, 3) + '***',
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

  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    if (!checkRateLimit()) return;

    try {
      setIsLoading(true);
      setError(null);
      
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
      
      const requiresConfirmation = !data.session;
      
      toast({
        title: 'Account created!',
        description: requiresConfirmation 
          ? 'Please check your email to verify your account.' 
          : 'Your account has been created successfully.',
      });

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

  const resetPassword = async (email: string) => {
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
      
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000 - elapsedTime));
      }
      
      toast({
        title: 'Password reset email sent',
        description: 'If an account with this email exists, you will receive password reset instructions.',
      });
      
      navigate('/auth?view=verification-pending', { replace: true });
    } catch (e) {
      console.error('Password reset error:', e);
      setError(e instanceof Error ? e : new Error('Unknown password reset error'));
      
      const elapsedTime = Date.now() - lastAuthAttempt;
      if (elapsedTime < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000 - elapsedTime));
      }
      
      toast({
        title: 'Password reset email sent',
        description: 'If an account with this email exists, you will receive password reset instructions.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
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

  const hasRole = (role: string): boolean => {
    return userRoles.includes(role);
  };

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

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
