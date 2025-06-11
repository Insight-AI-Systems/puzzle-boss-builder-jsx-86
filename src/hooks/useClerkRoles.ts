
import { useAuth, useOrganization } from '@clerk/clerk-react';

export const useClerkRoles = () => {
  const { userId, isSignedIn, isLoaded } = useAuth();
  const { organization, membership } = useOrganization();

  // Get user's role from Clerk organization membership
  const userRole = membership?.role || 'player';
  
  // Check if user has a specific role
  const hasRole = (role: string): boolean => {
    if (!isSignedIn || !membership) return false;
    
    // Super admins have all roles
    if (membership.role === 'super_admin') return true;
    
    return membership.role === role;
  };

  // Check if user has admin privileges
  const isAdmin = hasRole('super_admin') || hasRole('admin');

  // Check if user can access admin dashboard
  const canAccessAdminDashboard = (): boolean => {
    const adminRoles = ['super_admin', 'admin', 'category_manager', 'social_media_manager', 'partner_manager', 'cfo'];
    return adminRoles.some(role => hasRole(role));
  };

  // Check permissions based on role
  const hasPermission = (permission: string): boolean => {
    if (!isSignedIn || !membership) return false;
    
    // Define role permissions (we'll move this to Clerk later)
    const rolePermissions: Record<string, string[]> = {
      'super_admin': ['*'], // All permissions
      'admin': ['manage_users', 'manage_roles', 'manage_puzzles', 'view_analytics'],
      'category_manager': ['manage_categories', 'manage_puzzles'],
      'social_media_manager': ['manage_content', 'manage_marketing'],
      'partner_manager': ['manage_partners'],
      'cfo': ['view_financials', 'manage_finances'],
      'player': []
    };

    const userPermissions = rolePermissions[membership.role] || [];
    return userPermissions.includes('*') || userPermissions.includes(permission);
  };

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
