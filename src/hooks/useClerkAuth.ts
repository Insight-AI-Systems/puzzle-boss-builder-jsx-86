import React from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { sessionTracker } from '@/utils/sessionTracker';
import { setCurrentUserForCleanup, initializeSessionCleanup } from '@/utils/sessionCleanup';

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

// Admin emails - only used for initial profile creation, not ongoing role enforcement
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

  // Only check admin email status for new profile creation, not role determination
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isAdminEmailForNewProfiles = userEmail ? ADMIN_EMAILS.includes(userEmail) : false;

  console.log('🔐 useClerkAuth Hook State:', {
    isSignedIn,
    isLoaded,
    userEmail,
    isAdminEmailForNewProfiles,
    profileLoading,
    hasProfile: !!profile
  });

  // Initialize session cleanup on mount
  React.useEffect(() => {
    const cleanup = initializeSessionCleanup();
    return cleanup;
  }, []);

  // Session tracking - start/end sessions based on auth state
  React.useEffect(() => {
    if (isSignedIn && userEmail && user?.id) {
      // Start session tracking
      sessionTracker.startSession(userEmail, user.id);
      setCurrentUserForCleanup(userEmail);
    } else if (userEmail) {
      // End session tracking on logout
      sessionTracker.endSession(userEmail);
      setCurrentUserForCleanup(null);
    }
  }, [isSignedIn, userEmail, user?.id]);

  // Enhanced profile fetch - respects manual role changes
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
            // Update profile with Clerk ID but DON'T change role for existing profiles
            const updateData = { 
              clerk_user_id: user.id,
              updated_at: new Date().toISOString(),
              last_sign_in: new Date().toISOString() // SINGLE update on profile sync
            };
            
            const { data: updatedProfile } = await supabase
              .from('profiles')
              .update(updateData)
              .eq('id', emailProfile.id)
              .select()
              .single();
            
            data = updatedProfile;
          }
        }
        
        // Create new profile if none exists - only here we apply admin email logic
        if (!data) {
          console.log('📝 Creating new profile for user');
          const newProfile = {
            id: crypto.randomUUID(),
            clerk_user_id: user.id,
            email: userEmail,
            username: user.username || user.firstName || userEmail?.split('@')[0] || '',
            role: isAdminEmailForNewProfiles ? 'super_admin' : 'player', // Only for NEW profiles
            member_id: crypto.randomUUID(),
            last_sign_in: new Date().toISOString() // SINGLE update on profile creation
          };
          
          const { data: createdProfile } = await supabase
            .from('profiles')
            .insert(newProfile)
            .select()
            .single();
          
          data = createdProfile;
        } else if (data) {
          // For existing profiles, only update last_sign_in - RESPECT existing role
          console.log('✅ Found existing profile, respecting current role:', data.role);
          const { data: updatedProfile } = await supabase
            .from('profiles')
            .update({ 
              last_sign_in: new Date().toISOString(), // SINGLE update on sign-in
              updated_at: new Date().toISOString()
            })
            .eq('id', data.id)
            .select()
            .single();
          
          data = updatedProfile || data;
        }
        
        console.log('📋 Final profile result:', data);
        setProfile(data);
      } catch (error) {
        console.error('❌ Profile fetch error:', error);
        // For admin emails, create a fallback profile state only for new users
        if (isAdminEmailForNewProfiles) {
          console.log('🆘 Creating fallback admin profile state for new user');
          setProfile({
            id: user.id,
            clerk_user_id: user.id,
            role: 'super_admin',
            username: user.username || user.firstName || userEmail?.split('@')[0] || '',
            email: userEmail || '',
            avatar_url: user.imageUrl || null,
            bio: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        } else {
          setProfile(null);
        }
      } finally {
        setProfileLoading(false);
      }
    };

    setProfileLoading(true);
    fetchProfile();
  }, [user?.id, userEmail, isAdminEmailForNewProfiles, isSignedIn]);

  // Role determination - use database role value, no more automatic elevation
  const userRole: string = profile?.role || 'player';
  const userRoles: string[] = [userRole];

  // Admin check - based on actual database role, not email
  const isAdmin: boolean = userRole === 'super_admin' || userRole === 'admin';

  // Enhanced role checking - no more admin email override
  const hasRole = (role: string): boolean => {
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
  };

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
        roleSource: 'database' // Now always from database
      });
    }
  }, [isLoaded, isSignedIn, userEmail, userRole, isAdmin, profileLoading, profile, user?.id]);

  const signOut = async (): Promise<void> => {
    console.log('🚪 Starting sign out process');
    try {
      // End session tracking immediately
      if (userEmail) {
        sessionTracker.endSession(userEmail);
        setCurrentUserForCleanup(null);
      }
      
      await clerkSignOut();
      console.log('✅ Sign out completed successfully');
      // Clear local state
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
    
    // Role checking - respects manual changes
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
