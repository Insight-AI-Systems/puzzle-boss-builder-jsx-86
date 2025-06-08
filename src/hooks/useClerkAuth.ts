
import React from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
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

// Admin emails - centralized for consistency and security
const ADMIN_EMAILS = [
  'alan@insight-ai-systems.com',
  'alantbooth@xtra.co.nz',
  'rob.small.1234@gmail.com'
];

export const useClerkAuth = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerk();
  const [profile, setProfile] = React.useState<ClerkProfile | null>(null);
  const [profileLoading, setProfileLoading] = React.useState(true);

  // Authoritative admin email detection - this takes precedence
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isAdminEmail = userEmail ? ADMIN_EMAILS.includes(userEmail) : false;

  console.log('🔐 useClerkAuth Hook State:', {
    isSignedIn,
    isLoaded,
    userEmail,
    isAdminEmail,
    profileLoading,
    hasProfile: !!profile
  });

  // Enhanced profile fetch with admin prioritization
  React.useEffect(() => {
    if (!user?.id || !isSignedIn) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        console.log('🔍 Fetching profile for:', user.id, 'Email:', userEmail, 'IsAdmin:', isAdminEmail);
        
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
            // Update profile with Clerk ID and ensure admin role if admin email
            const updateData = { 
              clerk_user_id: user.id,
              updated_at: new Date().toISOString(),
              ...(isAdminEmail && { role: 'super_admin' }) // Force admin role for admin emails
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
        
        // Create new profile if none exists
        if (!data) {
          console.log('📝 Creating new profile for user');
          const newProfile = {
            id: crypto.randomUUID(),
            clerk_user_id: user.id,
            email: userEmail,
            username: user.username || user.firstName || userEmail?.split('@')[0] || '',
            role: isAdminEmail ? 'super_admin' : 'player', // Admin emails always get super_admin
            member_id: crypto.randomUUID()
          };
          
          const { data: createdProfile } = await supabase
            .from('profiles')
            .insert(newProfile)
            .select()
            .single();
          
          data = createdProfile;
        } else if (data && isAdminEmail && data.role !== 'super_admin') {
          // Ensure existing admin profiles have the correct role
          console.log('🔧 Fixing admin role for existing profile');
          const { data: updatedProfile } = await supabase
            .from('profiles')
            .update({ role: 'super_admin', updated_at: new Date().toISOString() })
            .eq('id', data.id)
            .select()
            .single();
          
          data = updatedProfile;
        }
        
        console.log('📋 Final profile result:', data);
        setProfile(data);
      } catch (error) {
        console.error('❌ Profile fetch error:', error);
        // For admin emails, create a fallback profile state
        if (isAdminEmail) {
          console.log('🆘 Creating fallback admin profile state');
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
  }, [user?.id, userEmail, isAdminEmail, isSignedIn]);

  // Role determination - admin emails always override database roles
  const userRole: string = isAdminEmail ? 'super_admin' : (profile?.role || 'player');
  const userRoles: string[] = [userRole];

  // Admin check - admin emails are ALWAYS admin regardless of database state
  const isAdmin: boolean = isAdminEmail || userRole === 'super_admin' || userRole === 'admin';

  // Enhanced role checking with admin email prioritization
  const hasRole = (role: string): boolean => {
    console.log('🔍 hasRole check:', { 
      role, 
      isAdminEmail, 
      userRole, 
      userRoles,
      hasRoleResult: isAdminEmail || userRoles.includes(role) || userRole === 'super_admin'
    });
    
    // Admin emails have all roles
    if (isAdminEmail) return true;
    
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
        isAdminEmail,
        userRole,
        isAdmin,
        profileLoaded: !profileLoading,
        hasProfile: !!profile,
        clerkUserId: user?.id
      });
    }
  }, [isLoaded, isSignedIn, userEmail, isAdminEmail, userRole, isAdmin, profileLoading, profile, user?.id]);

  const signOut = async (): Promise<void> => {
    await clerkSignOut();
  };

  return {
    // User data
    user,
    profile,
    isAuthenticated: isSignedIn,
    isLoading: !isLoaded || profileLoading,
    
    // Role checking - with admin email prioritization
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
