
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
  isAdmin: boolean;
  error: AuthError | Error | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOADING_TIMEOUT = 10000; // 10 seconds max loading time
const AUTH_RETRY_DELAY = 2000; // 2 seconds between retries

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [error, setError] = useState<AuthError | Error | null>(null);
  const { toast } = useToast();

  // Force loading to stop after timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('Auth loading timeout reached, forcing completion');
        setIsLoading(false);
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
      } else {
        setUserRole(null);
      }
    } catch (err) {
      console.error('Error in auth state change:', err);
      setError(err as Error);
      // Don't block loading on errors
      setUserRole('player');
    } finally {
      setIsLoading(false);
    }
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
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError(err as Error);
        setIsLoading(false);
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
    hasSession: !!session
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated,
        userRole,
        isAdmin,
        error,
        clearAuthError,
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
