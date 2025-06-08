
import React from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Simplified profile interface
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

// Admin emails - centralized for consistency
const ADMIN_EMAILS = [
  'alan@insight-ai-systems.com',
  'alantbooth@xtra.co.nz',
  'rob.small.1234@gmail.com'
];

export const useClerkAuth = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerk();

  // Simplified admin email detection
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isAdminEmail = userEmail ? ADMIN_EMAILS.includes(userEmail) : false;

  // Fetch user profile with simplified logic
  const profileQuery = useQuery<ClerkProfile | null>({
    queryKey: ['clerk-profile', user?.id],
    queryFn: async (): Promise<ClerkProfile | null> => {
      if (!user?.id) return null;
      
      console.log('🔍 Fetching profile for:', user.id);
      
      // Try to find profile by clerk_user_id first
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('clerk_user_id', user.id)
        .maybeSingle();
      
      // If no profile found by clerk_user_id, try by email
      if (!data && !error && userEmail) {
        const { data: emailProfile, error: emailError } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', userEmail)
          .maybeSingle();
        
        if (emailProfile && !emailError) {
          // Update profile with Clerk ID
          const { data: updatedProfile } = await supabase
            .from('profiles')
            .update({ 
              clerk_user_id: user.id,
              updated_at: new Date().toISOString()
            })
            .eq('id', emailProfile.id)
            .select()
            .single();
          
          data = updatedProfile;
        }
      }
      
      // Create new profile if none exists and user is admin
      if (!data && isAdminEmail) {
        const newProfile = {
          id: crypto.randomUUID(),
          clerk_user_id: user.id,
          email: userEmail,
          username: user.username || user.firstName || userEmail?.split('@')[0] || '',
          role: 'super_admin',
          member_id: crypto.randomUUID()
        };
        
        const { data: createdProfile } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();
        
        data = createdProfile;
      }
      
      console.log('📋 Profile result:', data);
      return data;
    },
    enabled: !!user?.id && isSignedIn,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const profile = profileQuery.data;
  const profileLoading = profileQuery.isLoading;

  // Simplified role determination - prioritize admin emails
  const userRole: string = isAdminEmail ? 'super_admin' : (profile?.role || 'player');
  const userRoles: string[] = [userRole];

  // Simplified admin check
  const isAdmin: boolean = isAdminEmail || userRole === 'super_admin' || userRole === 'admin';

  // Simplified role checking
  const hasRole = (role: string): boolean => {
    return isAdminEmail || userRoles.includes(role) || userRole === 'super_admin';
  };

  // Debug logging (simplified)
  React.useEffect(() => {
    if (isLoaded) {
      console.log('🔐 Auth Summary:', {
        isSignedIn,
        userEmail,
        isAdminEmail,
        userRole,
        isAdmin,
        profileLoaded: !profileLoading
      });
    }
  }, [isLoaded, isSignedIn, userEmail, isAdminEmail, userRole, isAdmin, profileLoading]);

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
