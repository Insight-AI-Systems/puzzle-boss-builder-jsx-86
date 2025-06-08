
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, ROLE_DEFINITIONS } from '@/types/userTypes';

export const usePermissions = () => {
  const { user, userRole, hasRole, isAdmin } = useAuth();

  const checkPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Get the user's role
    const currentRole = userRole as UserRole;
    
    // Super admin has all permissions
    if (currentRole === 'super_admin') return true;
    
    // Check if the user's role has the specific permission
    const roleDefinition = ROLE_DEFINITIONS[currentRole];
    return roleDefinition?.permissions.includes(permission) || false;
  };

  const hasPermission = (permission: string): boolean => {
    return checkPermission(permission);
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => checkPermission(permission));
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => checkPermission(permission));
  };

  const canManageUsers = (): boolean => checkPermission('manage_users');
  const canManageRoles = (): boolean => checkPermission('manage_roles');
  const canManagePuzzles = (): boolean => checkPermission('manage_puzzles');
  const canManageCategories = (): boolean => checkPermission('manage_categories');
  const canManagePartners = (): boolean => checkPermission('manage_partners');
  const canManageFinances = (): boolean => checkPermission('manage_finances');
  const canAccessAnalytics = (): boolean => checkPermission('access_analytics');

  return {
    checkPermission,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    canManageUsers,
    canManageRoles,
    canManagePuzzles,
    canManageCategories,
    canManagePartners,
    canManageFinances,
    canAccessAnalytics,
    isAdmin,
    hasRole,
  };
};
