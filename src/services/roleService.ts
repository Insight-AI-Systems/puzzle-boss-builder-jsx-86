import { UserRole } from '@/types/userTypes';
import { supabase } from '@/integrations/supabase/client';
import { debugLog, DebugLevel } from '@/utils/debug';
import { QueryClient } from '@tanstack/react-query';
import { isProtectedAdmin } from '@/config/securityConfig';

interface UserResponse {
  data: {
    id: string;
    email: string;
    role: string;
  };
  error: Error | null;
}

/**
 * Role Service
 * Manages user roles and permissions
 */
class RoleService {
  private static instance: RoleService;
  private queryClient: QueryClient | null = null;
  
  private constructor() {}
  
  public static getInstance(): RoleService {
    if (!RoleService.instance) {
      RoleService.instance = new RoleService();
    }
    return RoleService.instance;
  }

  /**
   * Set the QueryClient for cache invalidation
   */
  public setQueryClient(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }
  
  /**
   * Update a user's role
   */
  public async updateUserRole(userId: string, newRole: UserRole): Promise<UserResponse> {
    try {
      // First check if the user is a protected admin
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single();
      
      if (userError) {
        debugLog('RoleService', `Error getting user data: ${userError.message}`, DebugLevel.ERROR);
        return { data: null as any, error: userError };
      }
      
      // Check if protected admin - don't allow role changes
      if (userData.email && isProtectedAdmin(userData.email)) {
        const error = new Error('Cannot change role for protected admin');
        debugLog('RoleService', `Attempted to change protected admin role: ${userData.email}`, DebugLevel.ERROR);
        return { data: null as any, error };
      }
      
      // Update the user's role
      const { data, error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) {
        debugLog('RoleService', `Error updating user role: ${error.message}`, DebugLevel.ERROR);
        return { data: null as any, error };
      }
      
      // Invalidate relevant queries if we have a query client
      if (this.queryClient) {
        this.queryClient.invalidateQueries(['users']);
        this.queryClient.invalidateQueries(['user', userId]);
      }
      
      return { data, error: null };
    } catch (err) {
      debugLog('RoleService', `Exception updating user role: ${err}`, DebugLevel.ERROR);
      return { data: null as any, error: err instanceof Error ? err : new Error('Failed to update user role') };
    }
  }
  
  /**
   * Bulk update user roles
   */
  public async bulkUpdateUserRoles(userIds: string[], newRole: UserRole): Promise<{ 
    success: boolean, 
    updatedCount: number,
    error?: Error
  }> {
    try {
      // Call the server function to update roles
      const { data, error } = await supabase.functions.invoke('admin-update-roles', {
        body: { userIds, newRole }
      });
      
      if (error) {
        debugLog('RoleService', `Error in bulk update roles: ${error.message}`, DebugLevel.ERROR);
        return { success: false, updatedCount: 0, error };
      }
      
      // Invalidate relevant queries if we have a query client
      if (this.queryClient) {
        this.queryClient.invalidateQueries(['users']);
      }
      
      return { 
        success: true, 
        updatedCount: data.updatedCount || userIds.length,
      };
    } catch (err) {
      debugLog('RoleService', `Exception in bulk update roles: ${err}`, DebugLevel.ERROR);
      return { 
        success: false, 
        updatedCount: 0,
        error: err instanceof Error ? err : new Error('Failed to update user roles') 
      };
    }
  }
  
  /**
   * Check if one role can assign another role
   */
  public canAssignRole(currentUserRole: UserRole, roleToAssign: UserRole, targetUserId: string): boolean {
    // Super admins can assign any role
    if (currentUserRole === 'super_admin') {
      return true;
    }
    
    // Regular admins can't assign super_admin roles
    if (currentUserRole === 'admin' && roleToAssign !== 'super_admin') {
      return true;
    }
    
    // Category managers can only assign roles to users on their categories
    if (currentUserRole === 'category_manager') {
      return false; // Simplified - would need category checking logic in a real implementation
    }
    
    // Other roles can't assign roles
    return false;
  }
}

// Export singleton instance
export const roleService = RoleService.getInstance();
