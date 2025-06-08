
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

  // Enhanced admin email detection
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isAdminEmail = userEmail === 'alan@insight-ai-systems.com' || 
                     userEmail === 'alantbooth@xtra.co.nz' ||
                     userEmail === 'rob.small.1234@gmail.com';

  // Debug logging for admin detection
  React.useEffect(() => {
    if (isLoaded && user) {
      console.log('🔍 Admin Detection Debug:', {
        userEmail,
        isAdminEmail,
        clerkUserId: user.id,
        isSignedIn,
        timestamp: new Date().toISOString()
      });
    }
  }, [userEmail, isAdminEmail, user, isSignedIn, isLoaded]);

  // Fetch user profile from Supabase based on Clerk user
  const profileQuery = useQuery<ClerkProfile | null>({
    queryKey: ['clerk-profile', user?.id],
    queryFn: async (): Promise<ClerkProfile | null> => {
      if (!user?.id) return null;
      
      console.log('📋 Fetching profile for Clerk user:', user.id);
      
      // First, try to find existing profile by clerk_user_id
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('clerk_user_id', user.id)
        .single();
      
      console.log('📋 Profile query by clerk_user_id result:', { data, error });
      
      // If no profile found by clerk_user_id, try to find by email
      if (error && error.code === 'PGRST116' && user.primaryEmailAddress?.emailAddress) {
        console.log('📋 Trying to find profile by email:', user.primaryEmailAddress.emailAddress);
        
        const { data: emailProfile, error: emailError } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', user.primaryEmailAddress.emailAddress)
          .single();
        
        console.log('📋 Profile query by email result:', { emailProfile, emailError });
        
        if (emailProfile && !emailError) {
          // Update the existing profile with Clerk user ID
          console.log('📋 Updating existing profile with Clerk user ID');
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
          
          console.log('📋 Profile update result:', { updatedProfile, updateError });
          
          if (!updateError) {
            data = updatedProfile;
            error = null;
          }
        }
      }
      
      // If still no profile, create one with admin role for admin emails
      if (error && error.code === 'PGRST116') {
        console.log('📋 Creating new profile for user');
        const newProfile = {
          id: crypto.randomUUID(),
          clerk_user_id: user.id,
          email: user.primaryEmailAddress?.emailAddress || '',
          username: user.username || user.firstName || user.primaryEmailAddress?.emailAddress?.split('@')[0] || '',
          role: isAdminEmail ? 'super_admin' : 'player', // Auto-assign admin role for admin emails
          member_id: crypto.randomUUID()
        };
        
        console.log('📋 New profile data:', newProfile);
        
        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();
        
        console.log('📋 Profile creation result:', { createdProfile, createError });
        
        if (!createError) {
          data = createdProfile;
          error = null;
        }
      }
      
      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error fetching profile:', error);
        return null;
      }
      
      const finalProfile = data ? {
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
      
      console.log('📋 Final profile result:', finalProfile);
      return finalProfile;
    },
    enabled: !!user?.id && isSignedIn,
  });

  const profile = profileQuery.data;
  const profileLoading = profileQuery.isLoading;

  // Enhanced role determination with priority for admin emails
  const userRoles: string[] = isAdminEmail ? ['super_admin'] : (profile?.role ? [profile.role] : ['player']);
  const userRole: string = isAdminEmail ? 'super_admin' : (profile?.role || 'player');

  // Enhanced role checking functions
  const hasRole = (role: string): boolean => {
    const hasRoleResult = userRoles.includes(role) || userRole === 'super_admin' || isAdminEmail;
    console.log('🔐 Role check:', { role, userRoles, userRole, isAdminEmail, result: hasRoleResult });
    return hasRoleResult;
  };

  const isAdmin: boolean = hasRole('admin') || hasRole('super_admin') || isAdminEmail;

  // Debug logging for auth state
  React.useEffect(() => {
    if (isLoaded) {
      console.log('🔐 Auth State Debug:', {
        isSignedIn,
        userEmail,
        isAdminEmail,
        userRole,
        userRoles,
        isAdmin,
        profileLoaded: !profileLoading,
        profile: profile ? { id: profile.id, role: profile.role } : null
      });
    }
  }, [isLoaded, isSignedIn, userEmail, isAdminEmail, userRole, userRoles, isAdmin, profileLoading, profile]);

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
