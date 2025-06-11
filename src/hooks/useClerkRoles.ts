
import { useAuth, useOrganization } from '@clerk/clerk-react';

export const useClerkRoles = () => {
  const { userId, isSignedIn, isLoaded } = useAuth();
  const { organization, membership } = useOrganization();

  console.log('🔍 useClerkRoles Debug:', {
    isSignedIn,
    isLoaded,
    userId,
    organization: organization?.name,
    membership: membership?.role,
    membershipObject: membership
  });

  // Get user's role from Clerk organization membership - fix the role extraction
  let userRole = membership?.role || 'player';
  
  // Remove any "org:" prefix if it exists
  if (typeof userRole === 'string' && userRole.startsWith('org:')) {
    userRole = userRole.replace('org:', '');
  }
  
  console.log('🎭 Role Detection:', {
    rawMembershipRole: membership?.role,
    finalUserRole: userRole,
    isString: typeof userRole === 'string',
    hasOrgPrefix: membership?.role?.includes('org:')
  });
  
  // Check if user has a specific role
  const hasRole = (role: string): boolean => {
    if (!isSignedIn || !membership) {
      console.log('🚫 hasRole check failed: not signed in or no membership');
      return false;
    }
    
    let currentRole = membership.role;
    
    // Remove "org:" prefix if it exists
    if (typeof currentRole === 'string' && currentRole.startsWith('org:')) {
      currentRole = currentRole.replace('org:', '');
    }
    
    console.log('🔍 hasRole check:', { 
      requestedRole: role, 
      currentRole, 
      rawRole: membership.role,
      match: currentRole === role,
      superAdminOverride: currentRole === 'super_admin'
    });
    
    // Super admins have all roles
    if (currentRole === 'super_admin') return true;
    
    // Check specific role
    return currentRole === role;
  };

  // Check if user has admin privileges
  const isAdmin = hasRole('super_admin') || hasRole('admin');

  // Check if user can access admin dashboard
  const canAccessAdminDashboard = (): boolean => {
    const adminRoles = ['super_admin', 'admin', 'category_manager', 'social_media_manager', 'partner_manager', 'cfo'];
    const hasAccess = adminRoles.some(role => hasRole(role));
    
    console.log('🏛️ canAccessAdminDashboard check:', {
      userRole,
      adminRoles,
      hasAccess,
      membershipRole: membership?.role
    });
    
    return hasAccess;
  };

  // Check permissions based on role
  const hasPermission = (permission: string): boolean => {
    if (!isSignedIn || !membership) return false;
    
    let currentRole = membership.role;
    
    // Remove "org:" prefix if it exists
    if (typeof currentRole === 'string' && currentRole.startsWith('org:')) {
      currentRole = currentRole.replace('org:', '');
    }
    
    // Define role permissions
    const rolePermissions: Record<string, string[]> = {
      'super_admin': ['*'], // All permissions
      'admin': ['manage_users', 'manage_roles', 'manage_puzzles', 'view_analytics'],
      'category_manager': ['manage_categories', 'manage_puzzles'],
      'social_media_manager': ['manage_content', 'manage_marketing'],
      'partner_manager': ['manage_partners'],
      'cfo': ['view_financials', 'manage_finances'],
      'player': []
    };

    const userPermissions = rolePermissions[currentRole] || [];
    const hasPermissionResult = userPermissions.includes('*') || userPermissions.includes(permission);
    
    console.log('🔑 hasPermission check:', {
      permission,
      currentRole,
      rawRole: membership.role,
      userPermissions,
      hasPermissionResult
    });
    
    return hasPermissionResult;
  };

  console.log('📋 useClerkRoles Final State:', {
    userId,
    userRole,
    isSignedIn,
    isLoaded,
    isAdmin,
    canAccessDashboard: canAccessAdminDashboard(),
    organization: organization?.name,
    membership: membership?.role
  });

  return {
    userId,
    userRole,
    isSignedIn,
    isLoaded,
    isAdmin,
    hasRole,
    hasPermission,
    canAccessAdminDashboard,
    organization,
    membership
  };
};
