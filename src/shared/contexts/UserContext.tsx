
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { UserError } from '@/infrastructure/errors';
import { userValidation } from '@/data/validation/schemas/userSchemas';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserSessionState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export interface UserContextType extends UserSessionState {
  signUp: (email: string, password: string, userData?: Partial<UserProfile>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new UserError(error.message, 'PROFILE_FETCH_FAILED');
      }

      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    }
  }, [user]);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (session?.user) {
          await refreshProfile();
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [refreshProfile]);

  useEffect(() => {
    if (user) {
      refreshProfile();
    }
  }, [user, refreshProfile]);

  const signUp = async (email: string, password: string, userData?: Partial<UserProfile>) => {
    try {
      setLoading(true);
      setError(null);

      // Validate input
      const validationResult = userValidation.registration({
        email,
        password,
        ...userData
      });

      const { error } = await supabase.auth.signUp({
        email: validationResult.email,
        password: validationResult.password,
        options: {
          data: {
            full_name: validationResult.full_name,
            username: validationResult.username,
          }
        }
      });

      if (error) {
        throw new UserError(error.message, 'SIGNUP_FAILED');
      }

      toast.success('Account created successfully! Please check your email to verify your account.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create account';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      // Validate input
      const validationResult = userValidation.signIn({ email, password });

      const { error } = await supabase.auth.signInWithPassword({
        email: validationResult.email,
        password: validationResult.password,
      });

      if (error) {
        throw new UserError(error.message, 'SIGNIN_FAILED');
      }

      toast.success('Signed in successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw new UserError(error.message, 'SIGNOUT_FAILED');
      }

      setProfile(null);
      toast.success('Signed out successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      throw new UserError('User not authenticated', 'USER_NOT_AUTHENTICATED');
    }

    try {
      setLoading(true);
      setError(null);

      // Validate updates
      const validationResult = userValidation.profileUpdate(updates);

      const { error } = await supabase
        .from('profiles')
        .update(validationResult)
        .eq('id', user.id);

      if (error) {
        throw new UserError(error.message, 'PROFILE_UPDATE_FAILED');
      }

      await refreshProfile();
      toast.success('Profile updated successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      profile,
      loading,
      error,
      signUp,
      signIn,
      signOut,
      updateProfile,
      refreshProfile
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
