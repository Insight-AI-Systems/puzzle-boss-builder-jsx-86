import React from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';

// Simplified profile interface for Clerk-first auth
interface ClerkProfile {
  id: string;
  email: string | null;
  username: string | null;
  role: string;
  avatar_url: string | null;
  display_name: string;
  created_at: string;
  // Legacy compatibility fields
  clerk_user_id: string | null;
  bio: string | null;
  updated_at: string;
}

// SECURITY FIX: Removed hardcoded admin emails
// Roles should be managed through database only for security

export const useClerkAuth = () => {
  try {
    const { user, isSignedIn, isLoaded } = useUser();
    const { signOut: clerkSignOut } = useClerk();

  const userEmail = user?.primaryEmailAddress?.emailAddress;

  console.log('🔐 useClerkAuth - Clerk-first approach:', {
    isSignedIn,
    isLoaded,
    userId: user?.id,
    userEmail
  });

  // Get role from Clerk metadata (secure - no hardcoded emails)
  const getUserRole = React.useCallback((): string => {
    if (!user) return 'player';

    // SECURITY: Get role from Clerk user metadata only
    const roleFromMetadata = user.publicMetadata?.role as string;
    if (roleFromMetadata) {
      return roleFromMetadata;
    }

    // Default to player (secure default)
    return 'player';
  }, [user]);

  // Create simplified profile from Clerk data
  const profile = React.useMemo((): ClerkProfile | null => {
    if (!user) return null;

    const userEmail = user.primaryEmailAddress?.emailAddress;
    const role = getUserRole();
    const now = new Date().toISOString();

    return {
      id: user.id,
      email: userEmail || null,
      username: user.username || null,
      role,
      avatar_url: user.imageUrl || null,
      display_name: user.fullName || user.username || userEmail?.split('@')[0] || 'Anonymous User',
      created_at: user.createdAt?.toISOString() || now,
      // Legacy compatibility fields
      clerk_user_id: user.id,
      bio: null,
      updated_at: now
    };
  }, [user, getUserRole]);

  // Role checking functions
  const userRole = getUserRole();
  const userRoles = [userRole];
  const isAdmin = userRole === 'super_admin' || userRole === 'super-admin' || userRole === 'admin';

  const hasRole = React.useCallback((role: string): boolean => {
    console.log('🔍 hasRole check (Clerk-first):', { 
      role, 
      userRole, 
      hasRoleResult: userRoles.includes(role) || userRole === 'super_admin'
    });
    
    // Super admins have all roles
    if (userRole === 'super_admin') return true;
    
    // Check specific role
    return userRoles.includes(role);
  }, [userRole, userRoles]);

  const signOut = async (): Promise<void> => {
    console.log('🚪 Starting Clerk sign out');
    try {
      await clerkSignOut();
      console.log('✅ Clerk sign out completed');
    } catch (error) {
      console.error('❌ Clerk sign out error:', error);
      throw error;
    }
  };

  console.log('🔐 Clerk Auth Summary:', {
    isSignedIn,
    isLoaded,
    userRole,
    isAdmin,
    hasProfile: !!profile,
    authSource: 'clerk_only'
  });

  return {
    // User data
    user,
    profile,
    isAuthenticated: isSignedIn,
    isLoading: !isLoaded,
    
    // Role checking - Clerk only
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
  } catch (error) {
    console.error('❌ useClerkAuth error:', error);
    // Return safe fallback values if Clerk context is not available
    return {
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: true,
      userRole: 'player',
      userRoles: ['player'],
      hasRole: () => false,
      isAdmin: false,
      rolesLoaded: false,
      signOut: async () => {},
      error: error,
      session: null,
    };
  }
};
