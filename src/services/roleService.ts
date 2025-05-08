
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/userTypes';
import { debugLog, DebugLevel } from '@/utils/debug';
import { toast } from '@/hooks/use-toast';
import { userService } from './userService';
import { ROLE_DEFINITIONS } from '@/types/userTypes';
import { isProtectedAdmin, PROTECTED_ADMIN_EMAIL } from '@/utils/constants';

interface RoleChangeResult {
  success: boolean;
  error?: Error | null;
  message?: string;
}

/**
 * Role Service
 * Centralized service for handling user role operations
 */
export class RoleService {
  private static instance: RoleService;
  private maxRetries = 2;

  private constructor() {}

  /**
   * Get singleton instance of RoleService
   */
  public static getInstance(): RoleService {
    if (!RoleService.instance) {
      RoleService.instance = new RoleService();
    }
    return RoleService.instance;
  }

  /**
   * Update a user's role
   */
  public async updateUserRole(
    userId: string, 
    newRole: UserRole,
    currentUserRole: UserRole = 'super_admin'
  ): Promise<RoleChangeResult> {
    try {
      debugLog('RoleService', `Updating role for user ${userId} to ${newRole}`, DebugLevel.INFO);
      
      // Check if user is protected admin
      const user = await userService.getUserById(userId);
      if (user && isProtectedAdmin(user.email)) {
        debugLog('RoleService', 'Cannot change role of protected admin', DebugLevel.WARN);
        toast({
          title: "Operation not allowed",
          description: "Cannot change role of protected admin user",
          variant: "destructive",
        });
        return { success: false, message: 'Cannot change role of protected admin' };
      }
      
      // Check if current user has permission to assign this role
      if (!this.canAssignRole(currentUserRole, newRole)) {
        debugLog('RoleService', `User with role ${currentUserRole} cannot assign role ${newRole}`, DebugLevel.WARN);
        toast({
          title: "Permission denied",
          description: `You do not have permission to assign the ${newRole} role`,
          variant: "destructive",
        });
        return { success: false, message: 'Permission denied' };
      }
      
      // First, try direct update via Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
      
      if (error) {
        // If direct update fails, try edge function
        debugLog('RoleService', 'Direct role update failed, trying edge function', DebugLevel.INFO, { error });
        
        const { data, error: fnError } = await supabase.functions.invoke('update-user-role', {
          body: { userId, newRole }
        });
        
        if (fnError) {
          throw fnError;
        }
        
        if (!data?.success) {
          throw new Error(data?.message || 'Failed to update user role');
        }
      }
      
      toast({
        title: "Role updated",
        description: `User role has been updated to ${ROLE_DEFINITIONS[newRole]?.label || newRole}`,
      });
      
      return { success: true, message: 'Role updated successfully' };
      
    } catch (err) {
      debugLog('RoleService', `Error updating role for user ${userId}`, DebugLevel.ERROR, { error: err });
      
      toast({
        title: "Error updating role",
        description: err instanceof Error ? err.message : 'Unknown error occurred',
        variant: "destructive",
      });
      
      return { success: false, error: err instanceof Error ? err : new Error('Unknown error') };
    }
  }

  /**
   * Check if a user with a specific role can assign another role
   */
  public canAssignRole(userRole: UserRole, roleToAssign: UserRole): boolean {
    // Protected admin can assign any role
    if (userRole === 'super_admin') {
      return true;
    }
    
    // Look up in role definitions
    const roleDefinition = ROLE_DEFINITIONS[roleToAssign];
    if (!roleDefinition) {
      return false;
    }
    
    return roleDefinition.canBeAssignedBy.includes(userRole);
  }

  /**
   * Bulk update user roles
   */
  public async bulkUpdateRoles(
    userIds: string[], 
    newRole: UserRole,
    currentUserRole: UserRole = 'super_admin'
  ): Promise<RoleChangeResult> {
    try {
      debugLog('RoleService', `Bulk updating role for ${userIds.length} users to ${newRole}`, DebugLevel.INFO);
      
      // Check if current user has permission to assign this role
      if (!this.canAssignRole(currentUserRole, newRole)) {
        debugLog('RoleService', `User with role ${currentUserRole} cannot assign role ${newRole}`, DebugLevel.WARN);
        toast({
          title: "Permission denied",
          description: `You do not have permission to assign the ${newRole} role`,
          variant: "destructive",
        });
        return { success: false, message: 'Permission denied' };
      }
      
      // Filter out protected admin users
      const allUsers = await userService.getAllUsers();
      const filteredUserIds = userIds.filter(userId => {
        const user = allUsers.find(u => u.id === userId);
        return user && !isProtectedAdmin(user.email);
      });
      
      if (filteredUserIds.length !== userIds.length) {
        debugLog('RoleService', 'Some protected admin users were excluded from bulk role update', DebugLevel.WARN);
        toast({
          title: "Some users excluded",
          description: "Protected admin users cannot have their roles changed",
          variant: "warning",
        });
      }
      
      if (filteredUserIds.length === 0) {
        return { success: false, message: 'No eligible users to update' };
      }
      
      // Call the edge function for bulk update
      const { data, error } = await supabase.functions.invoke('bulk-update-roles', {
        body: { userIds: filteredUserIds, newRole }
      });
      
      if (error) {
        throw error;
      }
      
      if (!data?.success) {
        throw new Error(data?.message || 'Failed to bulk update user roles');
      }
      
      toast({
        title: "Roles updated",
        description: `Updated ${filteredUserIds.length} users to role: ${ROLE_DEFINITIONS[newRole]?.label || newRole}`,
      });
      
      return { 
        success: true, 
        message: `Updated ${filteredUserIds.length} users successfully` 
      };
      
    } catch (err) {
      debugLog('RoleService', 'Error in bulk role update', DebugLevel.ERROR, { error: err });
      
      toast({
        title: "Error updating roles",
        description: err instanceof Error ? err.message : 'Unknown error occurred',
        variant: "destructive",
      });
      
      return { success: false, error: err instanceof Error ? err : new Error('Unknown error') };
    }
  }

  /**
   * Check if user has a specific role
   */
  public async hasRole(userId: string, role: UserRole): Promise<boolean> {
    try {
      // Special case for protected admin
      const user = await userService.getUserById(userId);
      if (user && isProtectedAdmin(user.email)) {
        // Protected admin has all roles
        return true;
      }
      
      const { data, error } = await supabase.rpc('has_role', { 
        user_id: userId, 
        role_name: role 
      });
      
      if (error) {
        throw error;
      }
      
      return !!data;
      
    } catch (err) {
      debugLog('RoleService', `Error checking if user ${userId} has role ${role}`, DebugLevel.ERROR, { error: err });
      // Default to false on error
      return false;
    }
  }

  /**
   * Get available roles for assigning
   */
  public getAssignableRoles(currentUserRole: UserRole): UserRole[] {
    const allRoles = Object.keys(ROLE_DEFINITIONS) as UserRole[];
    
    if (currentUserRole === 'super_admin') {
      // Super admins can assign any role
      return allRoles;
    }
    
    // Filter roles that can be assigned by the current user role
    return allRoles.filter(role => {
      const definition = ROLE_DEFINITIONS[role];
      return definition && definition.canBeAssignedBy.includes(currentUserRole);
    });
  }

  /**
   * Get role label
   */
  public getRoleLabel(role: UserRole): string {
    return ROLE_DEFINITIONS[role]?.label || role;
  }

  /**
   * Get role description
   */
  public getRoleDescription(role: UserRole): string {
    return ROLE_DEFINITIONS[role]?.description || '';
  }

  /**
   * Get permissions for a role
   */
  public getRolePermissions(role: UserRole): string[] {
    return ROLE_DEFINITIONS[role]?.permissions || [];
  }
}

// Export singleton instance
export const roleService = RoleService.getInstance();
