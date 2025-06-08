

import React from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Define a simple, explicit interface for the profile data
interface ClerkProfile {
  id: string;
  clerk_user_id: string | null;
  role: string | null;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export const useClerkAuth = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerk();

  // Fetch user profile from Supabase based on Clerk user
  const profileQuery = useQuery<ClerkProfile | null>({
    queryKey: ['clerk-profile', user?.id],
    queryFn: async (): Promise<ClerkProfile | null> => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('clerk_user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data ? {
        id: data.id,
        clerk_user_id: data.clerk_user_id,
        role: data.role,
        username: data.username,
        email: data.email,
        avatar_url: data.avatar_url,
        bio: data.bio,
        created_at: data.created_at,
        updated_at: data.updated_at
      } : null;
    },
    enabled: !!user?.id && isSignedIn,
  });

  const profile = profileQuery.data;
  const profileLoading = profileQuery.isLoading;

  // Get user roles from Clerk metadata or Supabase
  const userRoles: string[] = (user?.publicMetadata?.roles as string[]) || ['player'];
  const userRole: string = userRoles[0] || 'player';

  // Role checking functions
  const hasRole = (role: string): boolean => {
    return userRoles.includes(role) || userRole === 'super_admin';
  };

  const isAdmin: boolean = hasRole('admin') || hasRole('super_admin');

  const signOut = async (): Promise<void> => {
    await clerkSignOut();
  };

  return {
    // User data
    user,
    profile,
    isAuthenticated: isSignedIn,
    isLoading: !isLoaded || profileLoading,
    
    // Role checking
    userRole,
    userRoles,
    hasRole,
    isAdmin,
    rolesLoaded: isLoaded,
    
    // Auth methods
    signOut,
    
    // Legacy compatibility
    error: null,
  };
};

