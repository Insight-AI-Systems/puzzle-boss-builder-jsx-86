import { supabase } from '@/integrations/supabase/client';
import { QueryClient } from '@tanstack/react-query';
import { UserRole } from '@/types/userTypes';
import { debugLog, DebugLevel } from '@/utils/debug';
import { isProtectedAdmin, PROTECTED_ADMIN_EMAIL } from '@/constants/securityConfig';
import { toast as useToast } from '@/hooks/use-toast';

/**
 * Service for managing user roles and permissions
 */
export class RoleService {
  private queryClient: QueryClient | null = null;
  private static instance: RoleService;
  private maxRetries = 3;

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
   * Set the QueryClient instance for cache invalidation
   */
  public setQueryClient(queryClient: QueryClient): void {
    this.queryClient = queryClient;
  }

  /**
   * Update a user's role
   * @param userId User ID to update
   * @param newRole New role to assign
   * @returns Promise with result
   */
  public async updateUserRole(userId: string, newRole: UserRole): Promise<{ success: boolean; error?: string }> {
    try {
      debugLog('RoleService', `Updating role for user ${userId} to ${newRole}`, DebugLevel.INFO);
      
      // Load toast notification indicator
      const loadingToast = useToast({
        title: 'Updating user role...',
        description: `Changing role to ${newRole}`,
        variant: 'default',
        duration: 10000,
      });
      
      // Try to update role through edge function
      try {
        const { data, error } = await supabase.functions.invoke('admin-update-roles', {
          body: {
            userIds: [userId],
            newRole
          }
        });
        
        if (error) {
          // Handle error from the edge function
          debugLog('RoleService', `Edge function error: ${error.message}`, DebugLevel.ERROR);
          
          // Dismiss loading toast
          if (loadingToast) {
            loadingToast.update({
              id: loadingToast.id,
              title: 'Error updating role',
              description: error.message,
              variant: 'destructive',
            });
          }
          return { success: false, error: error.message };
        }
        
        // Check if the update was successful
        const userResult = data?.results?.find((r: any) => r.id === userId);
        if (!userResult?.success) {
          const errorMsg = userResult?.error || 'Unknown error updating role';
          debugLog('RoleService', `Role update failed: ${errorMsg}`, DebugLevel.ERROR);
          
          // Dismiss loading toast
          if (loadingToast) {
            loadingToast.update({
              id: loadingToast.id,
              title: 'Error updating role',
              description: errorMsg,
              variant: 'destructive',
            });
          }
          return { success: false, error: errorMsg };
        }
        
        // Success case: update cached data
        debugLog('RoleService', `Role updated successfully to ${newRole}`, DebugLevel.INFO);
        
        // Invalidate user queries
        if (this.queryClient) {
          this.queryClient.invalidateQueries({ queryKey: ['user', userId] });
          this.queryClient.invalidateQueries({ queryKey: ['all-users'] });
        }
        
        // Dismiss loading toast with success
        if (loadingToast) {
          loadingToast.update({
            id: loadingToast.id,
            title: 'Role updated',
            description: `User's role changed to ${newRole}`,
            variant: 'default',
          });
        }
        
        return { success: true };
        
      } catch (err) {
        // Handle unexpected errors
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        debugLog('RoleService', `Exception in updateUserRole: ${errorMessage}`, DebugLevel.ERROR);
        
        // Dismiss loading toast
        if (loadingToast) {
          loadingToast.update({
            id: loadingToast.id,
            title: 'Error updating role',
            description: errorMessage,
            variant: 'destructive',
          });
        }
        
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      // Final error handler
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      debugLog('RoleService', `Top-level error in updateUserRole: ${errorMessage}`, DebugLevel.ERROR);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Update roles for multiple users at once
   * @param userIds Array of user IDs
   * @param newRole New role to assign to all users
   * @returns Promise with results
   */
  public async bulkUpdateRoles(userIds: string[], newRole: UserRole): Promise<{ 
    success: boolean; 
    results?: any[]; 
    error?: string;
  }> {
    try {
      debugLog('RoleService', `Bulk updating ${userIds.length} users to role ${newRole}`, DebugLevel.INFO);
      
      // Loading toast for bulk update
      const loadingToast = useToast({
        title: 'Updating user roles...',
        description: `Changing ${userIds.length} users to ${newRole}`,
        variant: 'default',
        duration: 30000,
      });
      
      try {
        const { data, error } = await supabase.functions.invoke('admin-update-roles', {
          body: {
            userIds,
            newRole
          }
        });
        
        if (error) {
          debugLog('RoleService', `Edge function error in bulk update: ${error.message}`, DebugLevel.ERROR);
          
          // Dismiss loading toast with error
          if (loadingToast) {
            loadingToast.update({
              id: loadingToast.id,
              title: 'Error updating roles',
              description: error.message,
              variant: 'destructive',
            });
          }
          
          return { success: false, error: error.message };
        }
        
        // Process results
        const successCount = data?.results?.filter((r: any) => r.success).length || 0;
        const failureCount = userIds.length - successCount;
        
        debugLog('RoleService', `Bulk update completed: ${successCount} successes, ${failureCount} failures`, DebugLevel.INFO);
        
        // Invalidate queries for all users
        if (this.queryClient) {
          this.queryClient.invalidateQueries({ queryKey: ['all-users'] });
        }
        
        // Show success toast
        if (loadingToast) {
          loadingToast.update({
            id: loadingToast.id,
            title: 'Roles updated',
            description: `Successfully updated ${successCount} of ${userIds.length} users to ${newRole}`,
            variant: failureCount > 0 ? 'default' : 'default',
          });
        }
        
        // Return results
        return { 
          success: successCount > 0, 
          results: data?.results || []
        };
        
      } catch (err) {
        // Handle unexpected errors
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        debugLog('RoleService', `Exception in bulkUpdateRoles: ${errorMessage}`, DebugLevel.ERROR);
        
        // Dismiss loading toast with error
        if (loadingToast) {
          loadingToast.update({
            id: loadingToast.id,
            title: 'Error updating roles',
            description: errorMessage,
            variant: 'destructive',
          });
        }
        
        return { success: false, error: errorMessage };
      }
      
    } catch (err) {
      // Final error handler
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      debugLog('RoleService', `Top-level error in bulkUpdateRoles: ${errorMessage}`, DebugLevel.ERROR);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Check if current user can assign a specific role
   */
  public canAssignRole(
    currentUserRole: UserRole, 
    targetRole: UserRole, 
    targetUserId: string,
    currentUserEmail?: string
  ): boolean {
    // Special case for protected admin
    if (currentUserEmail && isProtectedAdmin(currentUserEmail)) {
      return true;
    }
    
    // Role hierarchy checks
    const roleHierarchy: Record<string, number> = {
      'super_admin': 100,
      'admin': 80,
      'category_manager': 60,
      'social_media_manager': 50,
      'partner_manager': 50,
      'cfo': 50,
      'player': 10
    };
    
    // Check if the user's role has sufficient privileges
    const currentRoleLevel = roleHierarchy[currentUserRole] || 0;
    const targetRoleLevel = roleHierarchy[targetRole] || 0;
    
    // Can only assign roles of lower level than your own
    if (targetRoleLevel >= currentRoleLevel) {
      return false;
    }
    
    // Super admins can assign any role (except to other super admins)
    if (currentUserRole === 'super_admin') {
      return true;
    }
    
    // Regular admins can assign any role except super_admin
    if (currentUserRole === 'admin') {
      return targetRole !== 'super_admin';
    }
    
    // Other roles can't assign roles
    return false;
  }
}

// Export singleton instance
export const roleService = RoleService.getInstance();
