
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
        
        console.log('Auth state changed:', event, session?.user?.id);
        setCurrentUserId(session?.user?.id || null);
        setSession(session);
        
        if (['SIGNED_IN', 'SIGNED_OUT', 'USER_UPDATED', 'PASSWORD_RECOVERY'].includes(event)) {
          setIsLoading(false);
        }
      }
    );

    // Then check for existing session
    const getSession = async () => {
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
          console.log('Got session:', data.session?.user?.id);
          if (isActive) {
            setCurrentUserId(data.session?.user?.id || null);
            setSession(data.session);
          }
        }
      } catch (error) {
        console.error('Unexpected error getting session:', error);
        if (isActive) {
          setError(error instanceof Error ? error : new Error('Unknown auth error'));
          setIsLoading(false);
        }
      } finally {
        // Ensure loading state ends after a maximum wait time
        // This ensures the spinner doesn't get stuck
        if (isActive) {
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        }
      }
    };
    
    getSession();

    return () => {
      isActive = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { currentUserId, session, isLoading, error };
}
