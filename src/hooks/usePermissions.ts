
import { useClerkRoles } from '@/hooks/useClerkRoles';

export function usePermissions() {
  const { hasRole, isAdmin, userRole, hasPermission: clerkHasPermission, canAccessAdminDashboard } = useClerkRoles();

  const hasPermission = (permission: string): boolean => {
    return clerkHasPermission(permission);
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

  const canAssignRole = (targetRole: string): boolean => {
    // Super admins can assign any role
    if (hasRole('super_admin')) return true;
    
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
