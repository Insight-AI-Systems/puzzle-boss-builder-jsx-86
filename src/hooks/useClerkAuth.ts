import React from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { sessionTracker } from '@/utils/sessionTracker';
import { setCurrentUserForCleanup, initializeSessionCleanup } from '@/utils/sessionCleanup';

// Enhanced profile interface to match expectations
interface ClerkProfile {
  id: string;
  clerk_user_id: string | null;
  role: string | null;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  bio: string | null;
  display_name: string | null;
  created_at: string;
  updated_at: string;
}

// Admin emails - these users ALWAYS get super_admin role
const ADMIN_EMAILS = [
  'alan@insight-ai-systems.com',
  'alantbooth@xtra.co.nz',
  'rob.small.1234@gmail.com',
  'benbooth@xtra.co.nz',
  'tamara@insight-ai-systems.com',
  '0sunnysideup0@gmail.com'
];

export const useClerkAuth = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerk();
  const [profile, setProfile] = React.useState<ClerkProfile | null>(null);
  const [profileLoading, setProfileLoading] = React.useState(true);

  const userEmail = user?.primaryEmailAddress?.emailAddress;

  console.log('🔐 useClerkAuth Hook State:', {
    isSignedIn,
    isLoaded,
    userEmail,
    profileLoading,
    hasProfile: !!profile
  });

  // Initialize session cleanup on mount
  React.useEffect(() => {
    const cleanup = initializeSessionCleanup();
    return cleanup;
  }, []);

  // Session tracking
  React.useEffect(() => {
    if (isSignedIn && userEmail && user?.id) {
      sessionTracker.startSession(userEmail, user.id);
      setCurrentUserForCleanup(userEmail);
    } else if (userEmail) {
      sessionTracker.endSession(userEmail);
      setCurrentUserForCleanup(null);
    }
  }, [isSignedIn, userEmail, user?.id]);

  // Profile fetch with database-only role assignment
  React.useEffect(() => {
    if (!user?.id || !isSignedIn) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        console.log('🔍 Fetching profile for:', user.id, 'Email:', userEmail);
        
        // Try to find profile by clerk_user_id first
        let { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('clerk_user_id', user.id)
          .maybeSingle();
        
        // If no profile found by clerk_user_id, try by email
        if (!data && !error && userEmail) {
          console.log('🔍 No profile found by clerk_user_id, trying email:', userEmail);
          const { data: emailProfile, error: emailError } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', userEmail)
            .maybeSingle();
          
          if (emailProfile && !emailError) {
            console.log('📧 Found profile by email, updating with Clerk ID');
            // Update profile with Clerk ID (keep existing role from database)
            const updateData = { 
              clerk_user_id: user.id,
              updated_at: new Date().toISOString(),
              last_sign_in: new Date().toISOString()
            };
            
            const { data: updatedProfile, error: updateError } = await supabase
              .from('profiles')
              .update(updateData)
              .eq('id', emailProfile.id)
              .select()
              .single();
            
            if (!updateError) {
              data = updatedProfile;
            }
          }
        }
        
        // Create new profile if none exists (default to 'player' role)
        if (!data) {
          console.log('📝 Creating new profile for user');
          const newProfile = {
            id: crypto.randomUUID(),
            clerk_user_id: user.id,
            email: userEmail,
            username: user.username || user.firstName || userEmail?.split('@')[0] || '',
            role: 'player', // Always default to player - no hardcoded admin access
            member_id: crypto.randomUUID(),
            last_sign_in: new Date().toISOString()
          };
          
          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert(newProfile)
            .select()
            .single();
          
          if (!createError) {
            data = createdProfile;
          }
        } else if (data) {
          // For existing profiles, update last_sign_in only (keep existing role)
          console.log(`✅ Found existing profile with role: ${data.role}`);
          
          const { data: updatedProfile } = await supabase
            .from('profiles')
            .update({ 
              last_sign_in: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', data.id)
            .select()
            .single();
          
          data = updatedProfile || data;
        }
        
        // Transform to ClerkProfile format
        if (data) {
          const transformedProfile: ClerkProfile = {
            id: data.id,
            clerk_user_id: data.clerk_user_id,
            role: data.role,
            username: data.username,
            email: data.email,
            avatar_url: data.avatar_url,
            bio: data.bio,
            display_name: data.username || data.full_name || userEmail?.split('@')[0] || 'Anonymous User',
            created_at: data.created_at,
            updated_at: data.updated_at
          };
          
          console.log('📋 Final profile result:', transformedProfile);
          setProfile(transformedProfile);
        }
      } catch (error) {
        console.error('❌ Profile fetch error:', error);
        setProfile(null);
      } finally {
        setProfileLoading(false);
      }
    };

    setProfileLoading(true);
    fetchProfile();
  }, [user?.id, userEmail, isSignedIn]);

  // Role determination - use database role value ONLY
  const userRole: string = profile?.role || 'player';
  const userRoles: string[] = [userRole];

  // Admin check - based on actual database role only
  const isAdmin: boolean = userRole === 'super_admin' || userRole === 'admin';

  // Enhanced role checking with proper hierarchy
  const hasRole = React.useCallback((role: string): boolean => {
    console.log('🔍 hasRole check:', { 
      role, 
      userRole, 
      userRoles,
      hasRoleResult: userRoles.includes(role) || userRole === 'super_admin'
    });
    
    // Super admins have all roles
    if (userRole === 'super_admin') return true;
    
    // Check specific role
    return userRoles.includes(role);
  }, [userRole, userRoles]);

  // Enhanced debug logging
  React.useEffect(() => {
    if (isLoaded) {
      console.log('🔐 Auth Summary:', {
        isSignedIn,
        userEmail,
        userRole,
        isAdmin,
        profileLoaded: !profileLoading,
        hasProfile: !!profile,
        clerkUserId: user?.id,
        roleSource: 'database_only'
      });
    }
  }, [isLoaded, isSignedIn, userEmail, userRole, isAdmin, profileLoading, profile, user?.id]);

  const signOut = async (): Promise<void> => {
    console.log('🚪 Starting sign out process');
    try {
      if (userEmail) {
        sessionTracker.endSession(userEmail);
        setCurrentUserForCleanup(null);
      }
      
      await clerkSignOut();
      console.log('✅ Sign out completed successfully');
      setProfile(null);
    } catch (error) {
      console.error('❌ Sign out error:', error);
      throw error;
    }
  };

  return {
    // User data
    user,
    profile,
    isAuthenticated: isSignedIn,
    isLoading: !isLoaded || profileLoading,
    
    // Role checking - database only
    userRole,
    userRoles,
    hasRole,
    isAdmin,
    rolesLoaded: isLoaded,
    
    // Auth methods
    signOut,
    
    // Legacy compatibility
    error: null,
    session: null,
  };
};
