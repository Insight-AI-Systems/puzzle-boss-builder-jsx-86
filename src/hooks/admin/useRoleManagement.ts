
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserRole } from '@/types/userTypes';
import { adminService } from '@/services/adminService';
import { roleService } from '@/services/roleService';
import { debugLog, DebugLevel } from '@/utils/debug';

/**
 * Hook for role management functionality
 * Uses the RoleService for all role-related operations
 */
export function useRoleManagement() {
  const queryClient = useQueryClient();

  // Set the queryClient in the roleService
  roleService.setQueryClient(queryClient);

  const updateUserRole = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: UserRole }) => {
      debugLog('useRoleManagement', `Updating role for user ${userId} to ${newRole}`, DebugLevel.INFO);
      
      try {
        // Use the roleService to update the user role
        const result = await roleService.updateUserRole(userId, newRole);
        if (!result.success) {
          throw new Error(result.message || 'Failed to update user role');
        }
        return { userId, newRole, success: true };
      } catch (err) {
        debugLog('useRoleManagement', "Exception in updateUserRole:", DebugLevel.ERROR, { error: err });
        throw err;
      }
    }
  });

  const bulkUpdateRoles = useMutation({
    mutationFn: async ({ userIds, newRole }: { userIds: string[]; newRole: UserRole }) => {
      debugLog('useRoleManagement', `Bulk updating role to ${newRole} for ${userIds.length} users`, DebugLevel.INFO);
      
      try {
        // Use the roleService to bulk update roles
        const result = await roleService.bulkUpdateRoles(userIds, newRole);
        if (!result.success) {
          throw new Error(result.message || 'Failed to update user roles');
        }
        // Add a safe check for result.results
        const results = result.results || [];
        return { userIds, newRole, success: true, results };
      } catch (err) {
        debugLog('useRoleManagement', "Exception in bulkUpdateRoles:", DebugLevel.ERROR, { error: err });
        throw err;
      }
    }
  });

  /**
   * Check if current user can assign a specific role
   */
  const canAssignRole = (
    currentUserRole: UserRole, 
    targetRole: UserRole, 
    targetUserId: string,
    currentUserEmail?: string
  ): boolean => {
    return roleService.canAssignRole(currentUserRole, targetRole, targetUserId, currentUserEmail);
  };

  return {
    updateUserRole,
    bulkUpdateRoles,
    canAssignRole
  };
}
