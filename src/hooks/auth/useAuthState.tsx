
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

export function useAuthState() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
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
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          console.log('Got session:', data.session?.user?.id);
          setCurrentUserId(data.session?.user?.id || null);
          setSession(data.session);
        }
      } catch (error) {
        console.error('Unexpected error getting session:', error);
      } finally {
        // Ensure loading state ends after a maximum wait time
        // This ensures the spinner doesn't get stuck
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };
    
    getSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { currentUserId, session, isLoading };
}
