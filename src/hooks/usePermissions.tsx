
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, ROLE_DEFINITIONS } from '@/types/userTypes';

export function usePermissions() {
  const { hasRole, isAdmin, userRole } = useAuth();

  const hasPermission = (permission: string): boolean => {
    const currentRole = userRole as UserRole;
    
    // Super admins have all permissions
    if (currentRole === 'super-admin') return true;
    
    // Check if current role has the permission
    const roleDefinition = ROLE_DEFINITIONS[currentRole];
    if (!roleDefinition) return false;
    
    return roleDefinition.permissions.includes(permission);
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
    const currentRole = userRole as UserRole;
    return ['super-admin', 'admin', 'category_manager', 'social_media_manager', 'partner_manager', 'cfo'].includes(currentRole);
  };

  const canAssignRole = (targetRole: UserRole): boolean => {
    const currentRole = userRole as UserRole;
    const currentRoleDefinition = ROLE_DEFINITIONS[currentRole];
    const targetRoleDefinition = ROLE_DEFINITIONS[targetRole];
    
    if (!currentRoleDefinition || !targetRoleDefinition) return false;
    
    return targetRoleDefinition.canBeAssignedBy.includes(currentRole);
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
    userRole: userRole as UserRole
  };
}
