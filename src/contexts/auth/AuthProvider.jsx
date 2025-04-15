
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
} from './authUtils.jsx';
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
    console.log('[AUTH] Setting up auth state listener...');
    
    try {
      // Set up auth state listener FIRST
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log('[AUTH] Auth state changed:', event);
          setSession(session);
          setUser(session?.user ?? null);
          
          // Fetch profile data with setTimeout to avoid deadlock
          if (session?.user) {
            setTimeout(() => {
              console.log('[AUTH] Fetching profile for user:', session.user.id);
              fetchUserProfile(session.user.id).then(({ data, error }) => {
                if (error) {
                  console.error('[AUTH] Error fetching profile:', error);
                } else if (data) {
                  console.log('[AUTH] Profile fetched successfully');
                  setProfile(data);
                } else {
                  console.log('[AUTH] No profile data found');
                }
              });
            }, 0);
          } else {
            setProfile(null);
          }
        }
      );

      // THEN check for existing session
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (error) {
          console.error('[AUTH] Session check error:', error);
        }
        console.log('[AUTH] Initial session check:', session ? 'Session found' : 'No session');
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          fetchUserProfile(session.user.id).then(({ data, error }) => {
            if (error) {
              console.error('[AUTH] Error fetching profile:', error);
            }
            if (data) {
              console.log('[AUTH] Profile data:', data);
              setProfile(data);
            }
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      });

      return () => {
        console.log('[AUTH] Cleaning up auth subscription');
        if (subscription) {
          try {
            subscription.unsubscribe();
          } catch (err) {
            console.error('[AUTH] Error unsubscribing:', err);
          }
        }
      };
    } catch (error) {
      console.error('[AUTH] Critical error in auth setup:', error);
      setLoading(false);
      return () => {};
    }
  }, []);

  // Create API functions that use our utility functions but maintain state
  const signUp = async (email, password, username) => {
    try {
      return await authSignUp(email, password, username);
    } catch (error) {
      console.error('[AUTH] Sign up error:', error);
      return { error: { message: error.message || 'Sign up failed' } };
    }
  };

  const signIn = async (email, password) => {
    try {
      return await authSignIn(email, password);
    } catch (error) {
      console.error('[AUTH] Sign in error:', error);
      return { error: { message: error.message || 'Sign in failed' } };
    }
  };

  const signOut = async () => {
    try {
      return await authSignOut();
    } catch (error) {
      console.error('[AUTH] Sign out error:', error);
      return { error: { message: error.message || 'Sign out failed' } };
    }
  };

  const resetPassword = async (email) => {
    try {
      return await authResetPassword(email);
    } catch (error) {
      console.error('[AUTH] Reset password error:', error);
      return { error: { message: error.message || 'Password reset failed' } };
    }
  };
  
  const updateUserProfile = async (updates) => {
    if (!user) return { error: { message: "No user logged in" } };
    
    try {
      const { data, error } = await authUpdateProfile(user, updates);
      
      if (!error && data) {
        setProfile(data);
      }
      
      return { data, error };
    } catch (error) {
      console.error('[AUTH] Update profile error:', error);
      return { error: { message: error.message || 'Profile update failed' } };
    }
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
    throw new Error('[AUTH] useAuth must be used within an AuthProvider');
  }
  return context;
};
