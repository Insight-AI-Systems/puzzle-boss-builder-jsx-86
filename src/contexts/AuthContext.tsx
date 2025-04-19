import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/userTypes';
import { useAuthState } from '@/hooks/auth/useAuthState';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: AuthError | Error | null;
  
  signIn: (email: string, password: string, options?: { rememberMe?: boolean }) => Promise<void>;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  refreshSession: () => Promise<void>;
  
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasRole: (role: string) => boolean;
  userRole: UserRole | null;
  
  clearAuthError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { currentUserId, session, isLoading: authStateLoading, error: authStateError } = useAuthState();
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [lastAuthAttempt, setLastAuthAttempt] = useState<number>(0);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [error, setError] = useState<AuthError | Error | null>(authStateError);

  const { toast } = useToast();
  const navigate = useNavigate();

  const MIN_TIME_BETWEEN_AUTH_ATTEMPTS = 2000;

  const isAuthenticated = useMemo(() => !!currentUserId && !!session, [currentUserId, session]);
  const isAdmin = useMemo(() => userRole === 'admin' || userRole === 'super_admin', [userRole]);

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
        // Store both the role array for backward compatibility and the single role
        setUserRoles([profile.role]);
        setUserRole(profile.role as UserRole);
        return;
      }

      // Legacy support for user_roles table
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
        // For backward compatibility, use the first role as the primary role
        setUserRole(extractedRoles[0] as UserRole);
      } else {
        setUserRoles(['player']);
        setUserRole('player');
      }
    } catch (error) {
      console.error('Error fetching user roles:', error);
      setUserRoles(['player']);
      setUserRole('player');
    }
  };

  const trackSessionActivity = async (sessionId: string) => {
    if (!session?.user) return;
    
    try {
      await supabase
        .from('user_sessions')
        .update({
          last_active: new Date().toISOString()
        })
        .eq('user_id', session.user.id)
        .eq('session_token', sessionId);
    } catch (error) {
      console.error('Error updating session activity:', error);
    }
  };

  useEffect(() => {
    if (session?.user) {
      setTimeout(() => {
        fetchUserRoles(session.user.id);
        
        if (session.access_token) {
          trackSessionActivity(session.access_token);
        }
      }, 0);
    } else {
      setUserRoles([]);
      setUserRole(null);
    }
  }, [session?.user, session?.access_token]);

  const checkRateLimit = (): boolean => {
    const now = Date.now();
    if (now - lastAuthAttempt < MIN_TIME_BETWEEN_AUTH_ATTEMPTS) {
      setError(new Error('Too many auth attempts. Please wait before trying again.'));
      return false;
    }
    setLastAuthAttempt(now);
    return true;
  };

  const refreshSession = async (): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Session refresh error:', error);
        throw error;
      }
      
      if (data.session?.user) {
        await fetchUserRoles(data.session.user.id);
      }
    } catch (e) {
      console.error('Session refresh error:', e);
      if (e instanceof AuthError && e.status === 401) {
        navigate('/auth', { replace: true });
      }
      throw e;
    }
  };

  const signIn = async (email: string, password: string, options?: { rememberMe?: boolean }) => {
    if (!checkRateLimit()) return;
    
    try {
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
      
      if (data.session && data.user) {
        const { error: sessionError } = await supabase
          .from('user_sessions')
          .insert({
            user_id: data.user.id,
            session_token: data.session.access_token,
            user_agent: navigator.userAgent,
            ip_address: 'client-side',
            device_info: {
              platform: navigator.platform,
              userAgent: navigator.userAgent,
              language: navigator.language
            },
            is_active: true
          });
          
        if (sessionError) {
          console.error('Error creating session record:', sessionError);
        }
      }
      
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
    }
  };

  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    if (!checkRateLimit()) return;

    try {
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
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      
      if (session?.access_token && session?.user) {
        await supabase
          .from('user_sessions')
          .update({ is_active: false })
          .eq('user_id', session.user.id)
          .eq('session_token', session.access_token);
      }
      
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
    }
  };

  const resetPassword = async (email: string) => {
    if (!checkRateLimit()) return;

    try {
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
    }
  };

  const updatePassword = async (password: string) => {
    try {
      setError(null);
      
      if (!password || password.length < 8) {
        setError(new Error('Password must be at least 8 characters'));
        return;
      }
      
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        throw error;
      }
      
      if (session?.user) {
        await supabase
          .from('profiles')
          .update({
            last_password_change: new Date().toISOString()
          })
          .eq('id', session.user.id);
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
    }
  };

  const hasRole = (role: string): boolean => {
    if (userRole === role) return true;
    if (userRole === 'super_admin') return true;
    if (userRole === 'admin' && role !== 'super_admin') return true;
    return userRoles.includes(role);
  };

  const value: AuthContextType = {
    user: session?.user ?? null,
    session,
    isLoading: authStateLoading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshSession,
    isAuthenticated,
    isAdmin,
    hasRole,
    userRole,
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
