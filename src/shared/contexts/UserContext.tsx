
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { validateUser } from '@/data/validation';
import { UserError } from '@/infrastructure/errors';

export type UserRole = 'player' | 'admin' | 'category_manager' | 'moderator';

export interface UserProfile {
  id: string;
  member_id: string;
  email: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  credits: number;
  role: UserRole;
  marketing_opt_in: boolean;
  terms_accepted: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSessionState {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  sessionTimeout: number | null;
  lastActivity: number;
}

export interface UserContextType {
  session: UserSessionState;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: Partial<UserProfile>) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateCredits: (amount: number) => Promise<void>;
  refreshSession: () => Promise<void>;
  extendSession: () => void;
  clearSession: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const STORAGE_KEY = 'puzzleboss_session';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<UserSessionState>({
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
    sessionTimeout: null,
    lastActivity: Date.now()
  });

  const clearSession = useCallback(() => {
    setSession({
      user: null,
      profile: null,
      isLoading: false,
      isAuthenticated: false,
      sessionTimeout: null,
      lastActivity: Date.now()
    });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const extendSession = useCallback(() => {
    const now = Date.now();
    setSession(prev => ({
      ...prev,
      lastActivity: now,
      sessionTimeout: now + SESSION_TIMEOUT
    }));
  }, []);

  const loadProfile = useCallback(async (user: User): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (!data) return null;

      // Convert database profile to UserProfile type
      const profile: UserProfile = {
        id: data.id,
        member_id: data.member_id,
        email: data.email || user.email || '',
        username: data.username,
        full_name: data.full_name,
        avatar_url: data.avatar_url,
        credits: data.credits || 0,
        role: (data.role as UserRole) || 'player',
        marketing_opt_in: data.marketing_opt_in || false,
        terms_accepted: data.terms_accepted || false,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      return validateUser.profile(profile);
    } catch (error) {
      console.error('Error loading profile:', error);
      return null;
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const { data: { session: authSession }, error } = await supabase.auth.getSession();
      
      if (error) throw new UserError('Failed to refresh session', 'REFRESH_ERROR');

      if (authSession?.user) {
        const profile = await loadProfile(authSession.user);
        const now = Date.now();
        
        setSession({
          user: authSession.user,
          profile,
          isLoading: false,
          isAuthenticated: true,
          sessionTimeout: now + SESSION_TIMEOUT,
          lastActivity: now
        });

        // Persist session
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          userId: authSession.user.id,
          lastActivity: now
        }));
      } else {
        clearSession();
      }
    } catch (error) {
      console.error('Session refresh error:', error);
      clearSession();
    }
  }, [loadProfile, clearSession]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw new UserError(error.message, 'SIGNIN_ERROR');
      if (!data.user) throw new UserError('No user returned', 'SIGNIN_ERROR');

      const profile = await loadProfile(data.user);
      const now = Date.now();

      setSession({
        user: data.user,
        profile,
        isLoading: false,
        isAuthenticated: true,
        sessionTimeout: now + SESSION_TIMEOUT,
        lastActivity: now
      });
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }, [loadProfile]);

  const signUp = useCallback(async (email: string, password: string, userData?: Partial<UserProfile>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData || {}
        }
      });

      if (error) throw new UserError(error.message, 'SIGNUP_ERROR');
      if (!data.user) throw new UserError('No user returned', 'SIGNUP_ERROR');

      // User will need to verify email before session is established
      setSession(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new UserError(error.message, 'SIGNOUT_ERROR');
      
      clearSession();
    } catch (error) {
      console.error('Sign out error:', error);
      clearSession(); // Clear anyway
    }
  }, [clearSession]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    try {
      if (!session.user) throw new UserError('No authenticated user', 'UPDATE_ERROR');

      const validatedUpdates = validateUser.profileUpdate(updates);
      
      const { error } = await supabase
        .from('profiles')
        .update(validatedUpdates)
        .eq('id', session.user.id);

      if (error) throw new UserError(error.message, 'UPDATE_ERROR');

      setSession(prev => ({
        ...prev,
        profile: prev.profile ? { ...prev.profile, ...validatedUpdates } : null
      }));
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }, [session.user]);

  const updateCredits = useCallback(async (amount: number) => {
    try {
      if (!session.user || !session.profile) {
        throw new UserError('No authenticated user', 'CREDITS_ERROR');
      }

      const newCredits = Math.max(0, session.profile.credits + amount);
      
      const { error } = await supabase
        .from('profiles')
        .update({ credits: newCredits })
        .eq('id', session.user.id);

      if (error) throw new UserError(error.message, 'CREDITS_ERROR');

      setSession(prev => ({
        ...prev,
        profile: prev.profile ? { ...prev.profile, credits: newCredits } : null
      }));
    } catch (error) {
      console.error('Credits update error:', error);
      throw error;
    }
  }, [session.user, session.profile]);

  // Initialize session on mount
  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  // Set up auth listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, authSession) => {
        if (event === 'SIGNED_IN' && authSession?.user) {
          const profile = await loadProfile(authSession.user);
          const now = Date.now();
          
          setSession({
            user: authSession.user,
            profile,
            isLoading: false,
            isAuthenticated: true,
            sessionTimeout: now + SESSION_TIMEOUT,
            lastActivity: now
          });
        } else if (event === 'SIGNED_OUT') {
          clearSession();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [loadProfile, clearSession]);

  // Session timeout handler
  useEffect(() => {
    if (!session.sessionTimeout) return;

    const timeoutId = setTimeout(() => {
      console.log('Session timeout reached');
      clearSession();
    }, session.sessionTimeout - Date.now());

    return () => clearTimeout(timeoutId);
  }, [session.sessionTimeout, clearSession]);

  return (
    <UserContext.Provider value={{
      session,
      signIn,
      signUp,
      signOut,
      updateProfile,
      updateCredits,
      refreshSession,
      extendSession,
      clearSession
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
