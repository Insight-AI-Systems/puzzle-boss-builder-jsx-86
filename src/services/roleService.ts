
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/userTypes';
import { isProtectedAdmin, PROTECTED_ADMIN_EMAIL } from '@/constants/securityConfig';
import { debugLog, DebugLevel } from '@/utils/debug';
import { toast } from '@/hooks/use-toast';
import { QueryClient } from '@tanstack/react-query';
import { userService } from './userService';

/**
 * Role Service
 * Centralized service for handling all role-related operations
 */
export class RoleService {
  private queryClient: QueryClient | null = null;
  private static instance: RoleService;

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
  public setQueryClient(queryClient: QueryClient) {
    this.queryClient = queryClient;
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
    // Check if target user is protected admin
    if (isProtectedAdmin(targetUserId)) {
      debugLog('RoleService', "Cannot change protected admin's role", DebugLevel.WARN);
      return false;
    }
    
    // Special case: current user is protected admin (can do anything)
    if (isProtectedAdmin(currentUserEmail)) {
      debugLog('RoleService', "Protected admin can assign any role", DebugLevel.INFO);
      return true;
    }
    
    // Role assignment rules
    switch (currentUserRole) {
      case 'super_admin':
        // Super admins can assign any role
        return true;
      case 'admin':
        // Admins can't assign super_admin role
        return targetRole !== 'super_admin';
      // Add more role rules as needed
      default:
        return false;
    }
  }

  /**
   * Update a user's role with optimistic UI update
   */
  public async updateUserRole(
    userId: string, 
    newRole: UserRole,
    onSuccess?: () => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    try {
      // Validate inputs
      if (!userId || !newRole) {
        throw new Error('Invalid parameters: userId and newRole are required');
      }
      
      debugLog('RoleService', `Updating role for user ${userId} to ${newRole}`, DebugLevel.INFO);
      
      // Get current user to check permissions
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw new Error(`Failed to get current user: ${userError.message}`);
      }
      
      // Check if target user is protected admin
      if (userId === PROTECTED_ADMIN_EMAIL || isProtectedAdmin(userId)) {
        throw new Error("Protected admin's role cannot be changed");
      }
      
      // Optimistic UI update - We'll invalidate this cache later if the update fails
      if (this.queryClient) {
        // Get the current data from cache
        const previousData = this.queryClient.getQueryData(['all-users']);
        
        // Optimistically update the cache
        this.queryClient.setQueryData(['all-users'], (old: any) => {
          if (!old || !old.data) return old;
          
          return {
            ...old,
            data: old.data.map((user: any) => 
              user.id === userId 
                ? { ...user, role: newRole }
                : user
            )
          };
        });
        
        // Also update single user cache if it exists
        this.queryClient.setQueryData(['profile', userId], (oldUserData: any) => {
          if (!oldUserData) return oldUserData;
          return { ...oldUserData, role: newRole };
        });
      }
      
      // Show loading toast
      const loadingToastId = toast({
        title: "Updating role...",
        description: "Please wait while we update the user's role.",
      }).id;
      
      // Call the edge function to update the role
      const { data, error } = await supabase.functions.invoke('admin-update-roles', {
        body: { userIds: [userId], newRole }
      });
      
      if (error) {
        // Dismiss loading toast
        toast.dismiss(loadingToastId);
        
        // Show error toast
        toast({
          title: "Error updating role",
          description: error.message || "An unknown error occurred",
          variant: "destructive",
        });
        
        // Revert optimistic update
        if (this.queryClient) {
          this.queryClient.invalidateQueries({ queryKey: ['all-users'] });
          this.queryClient.invalidateQueries({ queryKey: ['profile', userId] });
        }
        
        debugLog('RoleService', "Error in updateUserRole:", DebugLevel.ERROR, { error });
        if (onError) onError(error);
        throw error;
      }
      
      // Dismiss loading toast
      toast.dismiss(loadingToastId);
      
      // Show success toast
      toast({
        title: "Role updated",
        description: `User's role has been changed to ${newRole}`,
        variant: "default",
      });
      
      // Make sure cache is updated with server data
      if (this.queryClient) {
        this.queryClient.invalidateQueries({ queryKey: ['all-users'] });
        this.queryClient.invalidateQueries({ queryKey: ['profile', userId] });
      }
      
      debugLog('RoleService', "Role update success:", DebugLevel.INFO, { data });
      if (onSuccess) onSuccess();
      
    } catch (err) {
      debugLog('RoleService', "Exception in updateUserRole:", DebugLevel.ERROR, { error: err });
      
      // Show error toast
      toast({
        title: "Error updating role",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      });
      
      if (onError) onError(err as Error);
      throw err;
    }
  }

  /**
   * Bulk update user roles
   */
  public async bulkUpdateRoles(
    userIds: string[], 
    newRole: UserRole,
    onSuccess?: () => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    if (!userIds.length || !newRole) {
      throw new Error('Invalid parameters: userIds and newRole are required');
    }
    
    try {
      debugLog('RoleService', `Bulk updating role to ${newRole} for ${userIds.length} users`, DebugLevel.INFO);
      
      // Filter out protected admin from bulk updates
      const filteredUserIds = userIds.filter(id => !isProtectedAdmin(id) && id !== PROTECTED_ADMIN_EMAIL);
      
      if (filteredUserIds.length < userIds.length) {
        debugLog('RoleService', "Protected admin users were excluded from bulk update", DebugLevel.WARN);
      }
      
      if (filteredUserIds.length === 0) {
        debugLog('RoleService', "No users to update after filtering", DebugLevel.WARN);
        throw new Error("No eligible users to update");
      }
      
      // Optimistic UI update
      if (this.queryClient) {
        this.queryClient.setQueryData(['all-users'], (old: any) => {
          if (!old || !old.data) return old;
          
          return {
            ...old,
            data: old.data.map((user: any) => 
              filteredUserIds.includes(user.id)
                ? { ...user, role: newRole }
                : user
            )
          };
        });
      }
      
      // Show loading toast
      const loadingToastId = toast({
        title: "Updating roles...",
        description: `Updating ${filteredUserIds.length} users to ${newRole} role`,
      }).id;
      
      const { data, error } = await supabase.functions.invoke('admin-update-roles', {
        body: { userIds: filteredUserIds, newRole }
      });
      
      // Dismiss loading toast
      toast.dismiss(loadingToastId);
      
      if (error) {
        // Show error toast
        toast({
          title: "Error updating roles",
          description: error.message || "An unknown error occurred",
          variant: "destructive",
        });
        
        // Revert optimistic update
        if (this.queryClient) {
          this.queryClient.invalidateQueries({ queryKey: ['all-users'] });
        }
        
        debugLog('RoleService', "Error in bulkUpdateRoles:", DebugLevel.ERROR, { error });
        if (onError) onError(error);
        throw error;
      }
      
      // Show success toast
      toast({
        title: "Roles updated",
        description: `${filteredUserIds.length} users have been updated to ${newRole}`,
        variant: "default",
      });
      
      // Make sure cache is updated with server data
      if (this.queryClient) {
        this.queryClient.invalidateQueries({ queryKey: ['all-users'] });
        for (const userId of filteredUserIds) {
          this.queryClient.invalidateQueries({ queryKey: ['profile', userId] });
        }
      }
      
      debugLog('RoleService', "Bulk role update success:", DebugLevel.INFO, { data });
      if (onSuccess) onSuccess();
      
    } catch (err) {
      debugLog('RoleService', "Exception in bulkUpdateRoles:", DebugLevel.ERROR, { error: err });
      
      // Show error toast
      toast({
        title: "Error updating roles",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      });
      
      if (onError) onError(err as Error);
      throw err;
    }
  }
}

// Export singleton instance
export const roleService = RoleService.getInstance();
