
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  fetchUserProfile, 
  signUp as authSignUp, 
  signIn as authSignIn, 
  signOut as authSignOut, 
  resetPassword as authResetPassword, 
  updateUserProfile as authUpdateProfile 
} from './authUtils';
import { useAuthRoles } from './useAuthRoles';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const { toast } = useToast();
  const roles = useAuthRoles(profile);

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch profile data with setTimeout to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id).then(({ data }) => {
              if (data) setProfile(data);
            });
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id).then(({ data }) => {
          if (data) setProfile(data);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  // Create API functions that use our utility functions but maintain state
  const signUp = async (email, password, username) => {
    return authSignUp(email, password, username);
  };

  const signIn = async (email, password) => {
    return authSignIn(email, password);
  };

  const signOut = async () => {
    return authSignOut();
  };

  const resetPassword = async (email) => {
    return authResetPassword(email);
  };
  
  const updateUserProfile = async (updates) => {
    if (!user) return { error: { message: "No user logged in" } };
    
    const { data, error } = await authUpdateProfile(user, updates);
    
    if (!error && data) {
      setProfile(data);
    }
    
    return { data, error };
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateUserProfile,
    ...roles
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
