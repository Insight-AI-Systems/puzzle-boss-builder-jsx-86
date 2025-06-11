
import { useClerkAuth } from '@/hooks/useClerkAuth';

export function usePermissions() {
  const { hasRole, isAdmin } = useClerkAuth();

  const hasPermission = (permission: string): boolean => {
    // For now, map permissions to roles
    switch (permission) {
      case 'admin':
        return hasRole('super_admin') || hasRole('admin');
      case 'manage_categories':
        return hasRole('super_admin') || hasRole('admin') || hasRole('category_manager');
      case 'manage_users':
        return hasRole('super_admin') || hasRole('admin');
      default:
        return false;
    }
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  return {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    isAdmin
  };
}
