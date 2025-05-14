
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthStateContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: AuthError | Error | null;
  isAuthenticated: boolean;
  clearAuthError: () => void;
}

const AuthStateContext = createContext<AuthStateContextType | undefined>(undefined);

export function AuthStateProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | Error | null>(null);

  // Clear any authentication errors
  const clearAuthError = () => setError(null);

  // Computed value
  const isAuthenticated = !!user && !!session;

  useEffect(() => {
    console.log('AuthStateProvider - Initializing auth state tracking');
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('AuthStateProvider - Auth state change event:', {
        event,
        userId: newSession?.user?.id,
        userEmail: newSession?.user?.email
      });
      
      // Update auth state
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });
    
    // Then check for existing session
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        console.log('AuthStateProvider - Checking for existing session');
        
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('AuthStateProvider - Error getting session:', sessionError);
          setError(sessionError);
          return;
        }
        
        console.log('AuthStateProvider - Initial session check result:', {
          hasSession: !!data.session,
          userId: data.session?.user?.id,
          userEmail: data.session?.user?.email
        });
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (err) {
        console.error('AuthStateProvider - Exception during initialization:', err);
        const authError = err as AuthError;
        setError(authError);
        
        toast({
          title: 'Authentication Error',
          description: authError.message || 'An error occurred while initializing authentication',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    // Initialize auth state
    initializeAuth();
    
    // Clean up subscription on unmount
    return () => {
      console.log('AuthStateProvider - Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);
  
  const value = {
    user,
    session,
    isLoading,
    error,
    isAuthenticated,
    clearAuthError,
  };

  return (
    <AuthStateContext.Provider value={value}>
      {children}
    </AuthStateContext.Provider>
  );
}

export function useAuthState() {
  const context = useContext(AuthStateContext);
  
  if (context === undefined) {
    throw new Error('useAuthState must be used within an AuthStateProvider');
  }
  
  return context;
}
