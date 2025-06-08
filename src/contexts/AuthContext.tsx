
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';

export interface AuthUser {
  id: string;
  email?: string;
  username?: string;
  role?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  userRole: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  session: any;
  error: Error | null;
  rolesLoaded: boolean;
  hasRole: (role: string) => boolean;
  signUp: (email: string, password: string, options?: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  updatePassword: (password: string) => Promise<any>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: clerkUser, isSignedIn, isLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerk();
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Convert Clerk user to our AuthUser format
  const user: AuthUser | null = clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress,
    username: clerkUser.username || clerkUser.firstName || clerkUser.primaryEmailAddress?.emailAddress?.split('@')[0],
    role: profile?.role || 'player'
  } : null;

  // Fetch user profile from Supabase when Clerk user is available
  useEffect(() => {
    const fetchProfile = async () => {
      if (!clerkUser?.id) {
        setProfile(null);
        setProfileLoading(false);
        return;
      }

      try {
        // First, try to find existing profile by clerk_user_id
        let { data: existingProfile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('clerk_user_id', clerkUser.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
          setProfile(null);
          setProfileLoading(false);
          return;
        }

        // If no profile exists, create one
        if (!existingProfile) {
          const profileData = {
            id: clerkUser.id, // Use Clerk ID as the primary key
            clerk_user_id: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress || '',
            username: clerkUser.username || clerkUser.firstName || clerkUser.primaryEmailAddress?.emailAddress?.split('@')[0] || '',
            role: 'player',
            member_id: clerkUser.id // Use clerk ID as member_id for consistency
          };

          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert(profileData)
            .select()
            .single();

          if (createError) {
            console.error('Error creating profile:', createError);
            setProfile(null);
          } else {
            setProfile(newProfile);
          }
        } else {
          setProfile(existingProfile);
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
        setProfile(null);
      } finally {
        setProfileLoading(false);
      }
    };

    if (isLoaded) {
      fetchProfile();
    }
  }, [clerkUser?.id, isLoaded]);

  const userRole = profile?.role || 'player';
  const isAdmin = userRole === 'admin' || userRole === 'super_admin';

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return userRole === role || userRole === 'super_admin';
  };

  const signOut = async (): Promise<any> => {
    try {
      await clerkSignOut();
      setProfile(null);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  // Stub implementations for compatibility
  const signUp = async (email: string, password: string, options?: any): Promise<any> => {
    return { error: new Error('Use Clerk sign-up components instead') };
  };

  const signIn = async (email: string, password: string): Promise<any> => {
    return { error: new Error('Use Clerk sign-in components instead') };
  };

  const resetPassword = async (email: string): Promise<any> => {
    return { error: new Error('Use Clerk password reset instead') };
  };

  const updatePassword = async (password: string): Promise<any> => {
    return { error: new Error('Use Clerk password update instead') };
  };

  const contextValue: AuthContextType = {
    user,
    userRole,
    isAuthenticated: isSignedIn,
    isLoading: !isLoaded || profileLoading,
    isAdmin,
    session: null, // Clerk handles sessions internally
    error: null,
    rolesLoaded: !profileLoading,
    hasRole,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
