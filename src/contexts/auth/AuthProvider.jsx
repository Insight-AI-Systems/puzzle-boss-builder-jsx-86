
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

// Create a separate context for loading state to avoid circular dependencies
const AuthLoadingContext = createContext(true);
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [initError, setInitError] = useState(null);
  const { toast } = useToast();
  const roles = useAuthRoles(profile);

  // Clear loading state after maximum timeout to prevent infinite loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('[AUTH] Loading timeout reached, forcing ready state');
        setLoading(false);
      }
    }, 5000); // 5 second maximum loading time
    
    return () => clearTimeout(timeoutId);
  }, [loading]);

  useEffect(() => {
    console.log('[AUTH] Setting up auth state listener...');
    let authSubscription = null;
    
    try {
      // Set up auth state listener FIRST with error handling
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, newSession) => {
          console.log('[AUTH] Auth state changed:', event);
          
          // Update session state synchronously
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          // If session exists, fetch profile in next tick to avoid deadlock
          if (newSession?.user) {
            setTimeout(() => {
              console.log('[AUTH] Fetching profile for user:', newSession.user.id);
              fetchUserProfile(newSession.user.id)
                .then(({ data, error }) => {
                  if (error) {
                    console.error('[AUTH] Error fetching profile:', error);
                  } else if (data) {
                    console.log('[AUTH] Profile fetched successfully');
                    setProfile(data);
                  } else {
                    console.log('[AUTH] No profile data found');
                  }
                })
                .catch(err => {
                  console.error('[AUTH] Exception fetching profile:', err);
                });
            }, 0);
          } else {
            setProfile(null);
          }
        }
      );
      
      authSubscription = subscription;

      // THEN check for existing session
      supabase.auth.getSession()
        .then(({ data: { session: initialSession }, error }) => {
          if (error) {
            console.error('[AUTH] Session check error:', error);
            setInitError(error.message);
          }
          
          console.log('[AUTH] Initial session check:', initialSession ? 'Session found' : 'No session');
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          
          if (initialSession?.user) {
            return fetchUserProfile(initialSession.user.id);
          }
          return { data: null };
        })
        .then(({ data, error }) => {
          if (error) {
            console.error('[AUTH] Error fetching profile:', error);
          }
          if (data) {
            console.log('[AUTH] Profile data:', data);
            setProfile(data);
          }
          // Always set loading to false after initial session check completes
          setLoading(false);
        })
        .catch(err => {
          console.error('[AUTH] Critical error in auth setup:', err);
          setInitError(err.message);
          setLoading(false);
        });

      return () => {
        console.log('[AUTH] Cleaning up auth subscription');
        if (authSubscription) {
          try {
            authSubscription.unsubscribe();
          } catch (err) {
            console.error('[AUTH] Error unsubscribing:', err);
          }
        }
      };
    } catch (error) {
      console.error('[AUTH] Critical error in auth setup:', error);
      setInitError(error.message);
      setLoading(false);
      return () => {
        if (authSubscription) {
          try {
            authSubscription.unsubscribe();
          } catch (err) {
            console.error('[AUTH] Error unsubscribing:', err);
          }
        }
      };
    }
  }, []);

  // Create API functions that use our utility functions but maintain state
  const signUp = async (email, password, username) => {
    try {
      const result = await authSignUp(email, password, username);
      return result;
    } catch (error) {
      console.error('[AUTH] Sign up error:', error);
      return { error: { message: error.message || 'Sign up failed' } };
    }
  };

  const signIn = async (email, password) => {
    try {
      const result = await authSignIn(email, password);
      return result;
    } catch (error) {
      console.error('[AUTH] Sign in error:', error);
      return { error: { message: error.message || 'Sign in failed' } };
    }
  };

  const signOut = async () => {
    try {
      const result = await authSignOut();
      return result;
    } catch (error) {
      console.error('[AUTH] Sign out error:', error);
      return { error: { message: error.message || 'Sign out failed' } };
    }
  };

  const resetPassword = async (email) => {
    try {
      const result = await authResetPassword(email);
      return result;
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
    initError,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateUserProfile,
    ...roles
  };

  // Provide the loading state separately to avoid circular dependencies
  return (
    <AuthLoadingContext.Provider value={loading}>
      <AuthContext.Provider value={value}>
        {initError ? (
          <div className="min-h-screen bg-puzzle-black flex items-center justify-center p-4">
            <div className="max-w-md p-6 bg-black/30 rounded-lg border border-red-500">
              <h2 className="text-xl text-puzzle-gold mb-4">Authentication Error</h2>
              <p className="text-white mb-4">There was a problem initializing authentication:</p>
              <div className="bg-red-900/20 p-3 rounded mb-4">
                <p className="text-red-400">{initError}</p>
              </div>
              <button
                className="w-full bg-puzzle-aqua text-black px-4 py-2 rounded"
                onClick={() => window.location.reload()}
              >
                Reload Application
              </button>
            </div>
          </div>
        ) : (
          children
        )}
      </AuthContext.Provider>
    </AuthLoadingContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('[AUTH] useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthLoading = () => {
  return useContext(AuthLoadingContext);
};
