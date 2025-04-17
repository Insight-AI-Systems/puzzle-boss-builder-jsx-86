
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

export function useAuthState() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isActive = true;
    
    // Set up auth state listener first
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (!isActive) return;
        
        console.log('Auth state changed:', event);
        setCurrentUserId(session?.user?.id || null);
        setSession(session);
        setIsLoading(false);
      }
    );

    // Immediately check for existing session
    const checkSession = async () => {
      try {
        if (!isActive) return;
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (isActive) {
            setError(error);
            setIsLoading(false);
          }
        } else {
          console.log('Got session:', data.session?.user?.id || 'No session');
          if (isActive) {
            setCurrentUserId(data.session?.user?.id || null);
            setSession(data.session);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Unexpected error getting session:', error);
        if (isActive) {
          setError(error instanceof Error ? error : new Error('Unknown auth error'));
          setIsLoading(false);
        }
      }
    };
    
    // Start session check immediately
    checkSession();

    return () => {
      isActive = false;
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  return { currentUserId, session, isLoading, error };
}
