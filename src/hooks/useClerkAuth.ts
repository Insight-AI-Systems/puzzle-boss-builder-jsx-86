
import React from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  clerk_user_id: string;
  role?: string;
  [key: string]: any;
}

export const useClerkAuth = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerk();

  // Fetch user profile from Supabase based on Clerk user
  const profileQuery = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
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
      
      return data as Profile | null;
    },
    enabled: !!user?.id && isSignedIn,
  });

  const profile = profileQuery.data;
  const profileLoading = profileQuery.isLoading;

  // Get user roles from Clerk metadata or Supabase
  const userRoles = (user?.publicMetadata?.roles as string[]) || ['player'];
  const userRole = userRoles[0] || 'player';

  // Role checking functions
  const hasRole = (role: string): boolean => {
    return userRoles.includes(role) || userRole === 'super_admin';
  };

  const isAdmin = hasRole('admin') || hasRole('super_admin');

  const signOut = async () => {
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
