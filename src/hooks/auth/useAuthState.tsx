
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export function useAuthState() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up auth state listener');
    
    // First set up auth state change listener 
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth state changed:', event, newSession?.user?.id);
        setSession(newSession);
        setUser(newSession?.user || null);
        setCurrentUserId(newSession?.user?.id || null);
        setIsLoading(false);
      }
    );

    // Then check for existing session
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session');
        const { data } = await supabase.auth.getSession();
        
        console.log('Initial session data:', data);
        
        if (data.session) {
          setSession(data.session);
          setUser(data.session.user);
          setCurrentUserId(data.session.user.id);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        // Always set loading to false after checking for session
        setIsLoading(false);
      }
    };
    
    getInitialSession();

    return () => {
      console.log('Cleaning up auth listener');
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { currentUserId, user, session, isLoading };
}
