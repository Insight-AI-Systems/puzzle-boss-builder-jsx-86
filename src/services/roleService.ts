
import { UserRole } from '@/types/userTypes';
import { supabase } from '@/integrations/supabase/client';
import { debugLog, DebugLevel } from '@/utils/debug';
import { isProtectedAdmin } from '@/config/securityConfig';

/**
 * Interface for user update response
 */
export interface UserResponse {
  success: boolean;
  error?: Error | null;
  message?: string;
  user?: any;
  results?: any[];
}

/**
 * Role Service
 * Handles role-related operations
 */
class RoleService {
  private static instance: RoleService;
  private queryClient: any = null;
  
  private constructor() {}
  
  /**
   * Get singleton instance
   */
  public static getInstance(): RoleService {
    if (!RoleService.instance) {
      RoleService.instance = new RoleService();
    }
    return RoleService.instance;
  }
  
  /**
   * Set query client for cache invalidation
   */
  public setQueryClient(client: any): void {
    this.queryClient = client;
  }
  
  /**
   * Update a user's role
   */
  public async updateUserRole(userId: string, newRole: UserRole): Promise<UserResponse> {
    try {
      // Check if this is the protected admin
      if (await this.isProtectedAdminId(userId)) {
        return {
          success: false,
          message: "Cannot change role for protected admin",
          error: new Error("Protected admin role cannot be modified")
        };
      }
      
      debugLog('RoleService', `Updating role for user ${userId} to ${newRole}`, DebugLevel.INFO);
      
      const { data, error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)
        .select();
      
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        message: `Role updated to ${newRole}`,
        user: data?.[0] || null
      };
      
    } catch (err) {
      debugLog('RoleService', `Error updating role for user ${userId}`, DebugLevel.ERROR, { error: err });
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Unknown error occurred',
        error: err instanceof Error ? err : new Error('Failed to update user role')
      };
    }
  }
  
  /**
   * Check if a user is the protected admin
   */
  private async isProtectedAdminId(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.admin.getUserById(userId);
      
      if (error || !data?.user) {
        return false;
      }
      
      return isProtectedAdmin(data.user.email);
    } catch (err) {
      debugLog('RoleService', `Error checking protected admin status for ${userId}`, DebugLevel.ERROR);
      return false;
    }
  }
  
  /**
   * Bulk update user roles
   */
  public async bulkUpdateUserRoles(userIds: string[], newRole: UserRole): Promise<UserResponse> {
    try {
      debugLog('RoleService', `Bulk updating roles for ${userIds.length} users to ${newRole}`, DebugLevel.INFO);
      
      if (!userIds.length) {
        return {
          success: false,
          message: "No users selected for update",
          error: new Error("No users selected")
        };
      }
      
      // Filter out protected admin if present
      const filteredIds = await this.filterOutProtectedAdmins(userIds);
      
      if (filteredIds.length === 0) {
        return {
          success: false,
          message: "Cannot update roles for protected admin accounts",
          error: new Error("Protected admin accounts filtered out")
        };
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .in('id', filteredIds);
      
      if (error) {
        throw error;
      }
      
      // Invalidate cache if query client exists
      if (this.queryClient) {
        this.queryClient.invalidateQueries({ queryKey: ['profiles'] });
      }
      
      return {
        success: true,
        message: `Updated ${filteredIds.length} user roles to ${newRole}`,
        results: filteredIds
      };
      
    } catch (err) {
      debugLog('RoleService', `Error bulk updating roles`, DebugLevel.ERROR, { error: err });
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Unknown error occurred',
        error: err instanceof Error ? err : new Error('Failed to update user roles')
      };
    }
  }
  
  /**
   * Filter out protected admins from a list of user IDs
   */
  private async filterOutProtectedAdmins(userIds: string[]): Promise<string[]> {
    // This is a simplified implementation
    // In a real implementation, you'd check each user against the protected admin list
    try {
      const filteredIds = [];
      
      for (const userId of userIds) {
        const isProtected = await this.isProtectedAdminId(userId);
        if (!isProtected) {
          filteredIds.push(userId);
        }
      }
      
      return filteredIds;
    } catch (err) {
      debugLog('RoleService', `Error filtering protected admins`, DebugLevel.ERROR);
      return userIds; // Return original list if filtering fails
    }
  }
  
  /**
   * Check if user can assign a role
   */
  public canAssignRole(currentUserRole: UserRole, targetRole: UserRole, userId: string, currentUserEmail?: string): boolean {
    if (isProtectedAdmin(currentUserEmail)) return true;
    
    if (currentUserRole === 'super_admin') return true;
    
    if (currentUserRole === 'admin') {
      return targetRole !== 'super_admin';
    }
    
    return false;
  }
}

export const roleService = RoleService.getInstance();
