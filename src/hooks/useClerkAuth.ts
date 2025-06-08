
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
      
      // First, try to find existing profile by clerk_user_id
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('clerk_user_id', user.id)
        .single();
      
      // If no profile found by clerk_user_id, try to find by email
      if (error && error.code === 'PGRST116' && user.primaryEmailAddress?.emailAddress) {
        const { data: emailProfile, error: emailError } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', user.primaryEmailAddress.emailAddress)
          .single();
        
        if (emailProfile && !emailError) {
          // Update the existing profile with Clerk user ID
          const { data: updatedProfile, error: updateError } = await supabase
            .from('profiles')
            .update({ 
              clerk_user_id: user.id,
              email: user.primaryEmailAddress.emailAddress,
              updated_at: new Date().toISOString()
            })
            .eq('id', emailProfile.id)
            .select()
            .single();
          
          if (!updateError) {
            data = updatedProfile;
            error = null;
          }
        }
      }
      
      // If still no profile, create one
      if (error && error.code === 'PGRST116') {
        const newProfile = {
          id: crypto.randomUUID(),
          clerk_user_id: user.id,
          email: user.primaryEmailAddress?.emailAddress || '',
          username: user.username || user.firstName || user.primaryEmailAddress?.emailAddress?.split('@')[0] || '',
          role: 'player', // Default role, will be overridden below for admin emails
          member_id: crypto.randomUUID()
        };
        
        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();
        
        if (!createError) {
          data = createdProfile;
          error = null;
        }
      }
      
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

  // Determine user role - check for admin emails first
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isAdminEmail = userEmail === 'alan@insight-ai-systems.com' || 
                     userEmail === 'alantbooth@xtra.co.nz' ||
                     userEmail === 'rob.small.1234@gmail.com';

  // Get user roles - prioritize admin emails
  const userRoles: string[] = isAdminEmail ? ['super_admin'] : (profile?.role ? [profile.role] : ['player']);
  const userRole: string = isAdminEmail ? 'super_admin' : (profile?.role || 'player');

  // Role checking functions
  const hasRole = (role: string): boolean => {
    return userRoles.includes(role) || userRole === 'super_admin' || isAdminEmail;
  };

  const isAdmin: boolean = hasRole('admin') || hasRole('super_admin') || isAdminEmail;

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
