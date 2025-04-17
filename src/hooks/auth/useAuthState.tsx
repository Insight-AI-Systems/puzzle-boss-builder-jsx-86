
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export function useAuthState() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setCurrentUserId(session?.user?.id || null);
        setIsLoading(false);
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
        }
      } catch (error) {
        console.error('Unexpected error getting session:', error);
      } finally {
        // Ensure loading state ends even if there's an error
        setIsLoading(false);
      }
    };
    
    getSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { currentUserId, isLoading };
}
