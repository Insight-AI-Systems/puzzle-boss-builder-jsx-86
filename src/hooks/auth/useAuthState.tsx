
import React, { useState, useEffect } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useAuthState() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    // Add enhanced logging
    console.log('useAuthState - Initializing auth state tracking');
    
    // Function to update auth state
    const updateAuthState = (newSession: Session | null) => {
      console.log('useAuthState - Auth state update:', {
        hasSession: !!newSession,
        userId: newSession?.user?.id,
        userEmail: newSession?.user?.email
      });
      
      setSession(newSession);
      setCurrentUserId(newSession?.user?.id || null);
    };
    
    // When the component mounts, check for an existing session
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        console.log('useAuthState - Checking for existing session');
        
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('useAuthState - Error getting session:', sessionError);
          setError(sessionError);
          return;
        }
        
        console.log('useAuthState - Initial session check result:', {
          hasSession: !!data.session,
          userId: data.session?.user?.id,
          userEmail: data.session?.user?.email
        });
        
        updateAuthState(data.session);
      } catch (err) {
        console.error('useAuthState - Exception during initialization:', err);
        if (err instanceof Error) {
          setError(err as AuthError);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    // Initialize auth state
    initializeAuth();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('useAuthState - Auth state change event:', {
        event,
        userId: newSession?.user?.id,
        userEmail: newSession?.user?.email
      });
      
      updateAuthState(newSession);
    });
    
    // Clean up subscription on unmount
    return () => {
      console.log('useAuthState - Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  return {
    currentUserId,
    session,
    isLoading,
    error
  };
}
