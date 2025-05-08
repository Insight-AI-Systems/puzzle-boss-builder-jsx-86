
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/userTypes';
import { debugLog, DebugLevel } from '@/utils/debug';
import { toast } from '@/hooks/use-toast';

// Rate limiting settings
const RATE_LIMIT = {
  maxOperations: 10,
  timeWindow: 60000, // 1 minute in milliseconds
  operations: [] as number[]
};

// Protected admin email
const PROTECTED_ADMIN_EMAIL = 'alan@insight-ai-systems.com';

interface RoleChangeResult {
  success: boolean;
  message?: string;
  error?: Error;
}

/**
 * Role Service
 * Centralized service for managing user roles
 */
class RoleService {
  private static instance: RoleService;
  
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
   * Check if a user has permission to change roles
   * @param currentUserRole - The role of the user attempting to make changes
   * @param targetUserId - The ID of the user whose role is being changed
   * @param targetUserEmail - The email of the user whose role is being changed
   * @param newRole - The new role being assigned
   */
  public canChangeRole(
    currentUserRole: UserRole,
    targetUserId: string,
    targetUserEmail: string | null | undefined,
    newRole: UserRole
  ): boolean {
    // Cannot change own role
    if (targetUserId === supabase.auth.getUser()?.data?.user?.id) {
      debugLog('roleService', 'Cannot change own role', DebugLevel.WARN);
      return false;
    }
    
    // Cannot change protected admin role
    if (this.isProtectedAdmin(targetUserEmail)) {
      debugLog('roleService', 'Cannot change protected admin role', DebugLevel.WARN);
      return false;
    }
    
    // Super admins can change any role
    if (currentUserRole === 'super_admin') {
      return true;
    }
    
    // Regular admins can change most roles except super_admin
    if (currentUserRole === 'admin') {
      return newRole !== 'super_admin';
    }
    
    // Category managers and other special roles have limited permissions
    if (['category_manager', 'social_media_manager', 'partner_manager', 'cfo'].includes(currentUserRole)) {
      // These roles typically can't change other users' roles
      return false;
    }
    
    // Regular players can't change roles
    return false;
  }
  
  /**
   * Update a user's role
   * @param userId - The ID of the user whose role is being changed
   * @param newRole - The new role to assign
   */
  public async updateUserRole(userId: string, newRole: UserRole): Promise<RoleChangeResult> {
    try {
      // Check if we're within rate limits
      if (!this.checkRateLimit()) {
        return { 
          success: false, 
          message: 'Rate limit exceeded. Please try again later.',
          error: new Error('Rate limit exceeded')
        };
      }

      debugLog('roleService', `Updating role for user ${userId} to ${newRole}`, DebugLevel.INFO);
      
      // Get current user info
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      // Get target user info to check if they're protected
      const { data: targetUserData } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single();
      
      if (targetUserData && this.isProtectedAdmin(targetUserData.email)) {
        debugLog('roleService', 'Cannot change protected admin role', DebugLevel.ERROR);
        return { 
          success: false, 
          message: 'Cannot modify the protected admin account.',
          error: new Error('Protected admin modification attempted')
        };
      }
      
      // Update the role
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Log the successful role change
      this.logRoleChange(currentUser?.id || 'unknown', userId, newRole);
      
      debugLog('roleService', `Role updated successfully for user ${userId}`, DebugLevel.INFO);
      
      return { success: true };
      
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update role');
      debugLog('roleService', 'Error updating role', DebugLevel.ERROR, { error });
      
      return { 
        success: false, 
        message: error.message,
        error
      };
    }
  }
  
  /**
   * Update roles for multiple users
   * @param userIds - Array of user IDs whose roles will be changed
   * @param newRole - The new role to assign to all users
   */
  public async bulkUpdateRoles(userIds: string[], newRole: UserRole): Promise<RoleChangeResult> {
    try {
      if (userIds.length === 0) {
        return {
          success: false,
          message: 'No users selected for role update',
          error: new Error('No users selected')
        };
      }

      // Check if we're within rate limits (count each user as an operation)
      if (!this.checkRateLimit(userIds.length)) {
        return { 
          success: false, 
          message: 'Rate limit exceeded. Please try fewer users or try again later.',
          error: new Error('Rate limit exceeded')
        };
      }

      debugLog('roleService', `Bulk updating roles for ${userIds.length} users to ${newRole}`, DebugLevel.INFO);
      
      // Get current user info
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      // First check for protected admins in the list
      const { data: targetUsersData } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', userIds);
      
      if (targetUsersData) {
        // Filter out protected admins
        const protectedAdmins = targetUsersData.filter(user => 
          this.isProtectedAdmin(user.email)
        );
        
        if (protectedAdmins.length > 0) {
          // Log the attempt
          debugLog('roleService', 'Attempted to change protected admin roles in bulk operation', DebugLevel.WARN);
          
          // Remove protected admins from the list
          userIds = userIds.filter(id => 
            !protectedAdmins.some(admin => admin.id === id)
          );
          
          if (userIds.length === 0) {
            return {
              success: false,
              message: 'Cannot update roles. All selected users are protected admins.',
              error: new Error('All selected users are protected')
            };
          }
        }
      }

      // We'll use edge function for bulk operations to avoid client-side loops
      const { data, error } = await supabase.functions.invoke('admin-update-roles', {
        body: {
          userIds,
          newRole,
          currentUserId: currentUser?.id
        }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.message || 'Failed to update roles');
      }
      
      debugLog('roleService', `Bulk role update successful for ${userIds.length} users`, DebugLevel.INFO);
      
      return { 
        success: true,
        message: `Successfully updated ${data.updatedCount || userIds.length} user roles to ${newRole}`
      };
      
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to bulk update roles');
      debugLog('roleService', 'Error in bulk role update', DebugLevel.ERROR, { error });
      
      return { 
        success: false, 
        message: error.message,
        error
      };
    }
  }
  
  /**
   * Verify if a user role change is valid
   * @param currentRole - The current role of the user
   * @param newRole - The proposed new role
   */
  public isValidRoleChange(currentRole: UserRole, newRole: UserRole): boolean {
    // Invalid if trying to change to the same role
    if (currentRole === newRole) {
      return false;
    }
    
    // Super admin can only be assigned by another super admin
    if (newRole === 'super_admin' && currentRole !== 'super_admin') {
      return false;
    }
    
    return true;
  }
  
  /**
   * Check if an email belongs to the protected admin
   * @param email - The email to check
   */
  public isProtectedAdmin(email?: string | null): boolean {
    if (!email) return false;
    return email.toLowerCase() === PROTECTED_ADMIN_EMAIL.toLowerCase();
  }
  
  /**
   * Rate limiting implementation
   * @param count - Number of operations to check against the rate limit
   */
  private checkRateLimit(count: number = 1): boolean {
    const now = Date.now();
    
    // Remove operations outside the time window
    RATE_LIMIT.operations = RATE_LIMIT.operations.filter(timestamp => 
      now - timestamp < RATE_LIMIT.timeWindow
    );
    
    // Check if adding these operations would exceed the limit
    if (RATE_LIMIT.operations.length + count > RATE_LIMIT.maxOperations) {
      return false;
    }
    
    // Add the new operations
    for (let i = 0; i < count; i++) {
      RATE_LIMIT.operations.push(now);
    }
    
    return true;
  }
  
  /**
   * Log role changes for audit purposes
   */
  private logRoleChange(adminId: string, targetUserId: string, newRole: UserRole): void {
    try {
      supabase.from('security_audit_logs').insert({
        event_type: 'role_change',
        user_id: adminId,
        severity: 'medium',
        details: {
          target_user_id: targetUserId,
          new_role: newRole,
          timestamp: new Date().toISOString()
        }
      }).then(({ error }) => {
        if (error) {
          debugLog('roleService', 'Error logging role change', DebugLevel.ERROR, { error });
        }
      });
    } catch (err) {
      debugLog('roleService', 'Error in audit logging', DebugLevel.ERROR, { error: err });
    }
  }
}

// Export singleton instance
export const roleService = RoleService.getInstance();
