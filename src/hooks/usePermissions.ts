import { useClerkAuth } from '@/hooks/useClerkAuth';

export function usePermissions() {
  const { hasRole, isAdmin, userRole } = useClerkAuth();

  const hasPermission = (permission: string): boolean => {
    // Super admins have all permissions - handle both formats
    console.log(`🔍 hasPermission check: ${permission}, userRole: ${userRole}`);
    if (userRole === 'super_admin' || userRole === 'super-admin') {
      console.log(`✅ Super admin granted permission: ${permission}`);
      return true;
    }
    
    // Define basic permissions based on roles
    const rolePermissions: Record<string, string[]> = {
      'super_admin': ['*'], // All permissions
      'super-admin': ['*'], // All permissions (hyphen format)
      'admin': ['manage_users', 'manage_roles', 'manage_puzzles', 'view_analytics'],
      'category_manager': ['manage_categories', 'manage_puzzles'],
      'social_media_manager': ['manage_content', 'manage_marketing'],
      'partner_manager': ['manage_partners'],
      'cfo': ['view_financials', 'manage_finances'],
      'player': []
    };

    const userPermissions = rolePermissions[userRole] || [];
    return userPermissions.includes('*') || userPermissions.includes(permission);
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const canManageUsers = (): boolean => {
    return hasPermission('manage_users');
  };

  const canManageRoles = (): boolean => {
    return hasPermission('manage_roles');
  };

  const canAccessAdminDashboard = (): boolean => {
    const adminRoles = ['super_admin', 'super-admin', 'admin', 'category_manager', 'social_media_manager', 'partner_manager', 'cfo'];
    return adminRoles.includes(userRole);
  };

  const canAssignRole = (targetRole: string): boolean => {
    // Super admins can assign any role - handle both formats
    if (hasRole('super_admin') || hasRole('super-admin')) return true;
    
    // Admins can assign non-admin roles
    if (hasRole('admin') && !['super_admin', 'admin'].includes(targetRole)) return true;
    
    return false;
  };

  return {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    canManageUsers,
    canManageRoles,
    canAccessAdminDashboard,
    canAssignRole,
    isAdmin,
    userRole
  };
}