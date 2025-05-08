
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, ROLE_DEFINITIONS } from '@/types/userTypes';

export function usePermissions() {
  const { user, hasRole } = useAuth();
  
  /**
   * Check if the current user has the specified permission
   */
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Super admins have all permissions
    if (hasRole('super_admin')) return true;
    
    // Get the user's role
    let userRole: keyof typeof ROLE_DEFINITIONS | null = null;
    
    if (hasRole('admin')) userRole = 'admin';
    else if (hasRole('category_manager')) userRole = 'category_manager';
    else if (hasRole('social_media_manager')) userRole = 'social_media_manager';
    else if (hasRole('partner_manager')) userRole = 'partner_manager';
    else if (hasRole('cfo')) userRole = 'cfo';
    else if (hasRole('player')) userRole = 'player';
    else if (hasRole('regular')) userRole = 'regular';
    else if (hasRole('user')) userRole = 'user';
    
    if (!userRole || !ROLE_DEFINITIONS[userRole]) return false;
    
    // Check if the role has the required permission
    return ROLE_DEFINITIONS[userRole].permissions.includes(permission);
  };
  
  /**
   * Check if the current user can assign a role to another user
   */
  const canAssignRole = (role: UserRole): boolean => {
    if (!user) return false;
    
    // Super admins can assign any role
    if (hasRole('super_admin')) return true;
    
    // Get the user's role
    let userRole: keyof typeof ROLE_DEFINITIONS | null = null;
    
    if (hasRole('admin')) userRole = 'admin';
    else if (hasRole('category_manager')) userRole = 'category_manager';
    else if (hasRole('social_media_manager')) userRole = 'social_media_manager';
    else if (hasRole('partner_manager')) userRole = 'partner_manager';
    else if (hasRole('cfo')) userRole = 'cfo';
    else if (hasRole('player')) userRole = 'player';
    else if (hasRole('regular')) userRole = 'regular';
    else if (hasRole('user')) userRole = 'user';
    
    if (!userRole || !ROLE_DEFINITIONS[userRole]) return false;
    
    // Check if the role can be assigned by the current user's role
    const targetRole = ROLE_DEFINITIONS[role];
    return targetRole.canBeAssignedBy.includes(userRole);
  };
  
  /**
   * Check if the current user has all of the specified permissions
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user) return false;
    
    // Super admins have all permissions
    if (hasRole('super_admin')) return true;
    
    return permissions.every(permission => hasPermission(permission));
  };
  
  /**
   * Check if the current user has any of the specified permissions
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user) return false;
    
    // Super admins have all permissions
    if (hasRole('super_admin')) return true;
    
    return permissions.some(permission => hasPermission(permission));
  };
  
  return {
    hasPermission,
    canAssignRole,
    hasAllPermissions,
    hasAnyPermission
  };
}
