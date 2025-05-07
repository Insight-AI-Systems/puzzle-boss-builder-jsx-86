
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/userTypes';
import { isProtectedAdmin, PROTECTED_ADMIN_EMAIL } from '@/constants/securityConfig';
import { debugLog, DebugLevel } from '@/utils/debug';
import { toast } from '@/hooks/use-toast';

export function useRoleManagement() {
  const queryClient = useQueryClient();

  const updateUserRole = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: UserRole }) => {
      debugLog('useRoleManagement', `Updating role for user ${userId} to ${newRole}`, DebugLevel.INFO);
      
      try {
        // Get the user's email to check if they're a protected admin
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          throw new Error(`Failed to get current user: ${userError.message}`);
        }
        
        // Check if target user is protected admin
        if (userId === PROTECTED_ADMIN_EMAIL || isProtectedAdmin(userId)) {
          debugLog('useRoleManagement', "Cannot change protected admin's role", DebugLevel.WARN);
          throw new Error("Protected admin's role cannot be changed");
        }
        
        // Check if current user is protected admin (can do anything)
        const isCurrentUserProtectedAdmin = isProtectedAdmin(userData?.user?.email);
        
        // If not protected admin, perform regular role update
        const { data, error } = await supabase.functions.invoke('admin-update-roles', {
          body: { userIds: [userId], newRole }
        });
        
        if (error) {
          debugLog('useRoleManagement', "Error in updateUserRole:", DebugLevel.ERROR, { error });
          throw new Error(`Failed to update role: ${error.message}`);
        }
        
        debugLog('useRoleManagement', "Role update success:", DebugLevel.INFO, { data });
        toast({
          title: "Role updated",
          description: `User's role has been changed to ${newRole}`,
        });
        
        return data;
      } catch (err) {
        debugLog('useRoleManagement', "Exception in updateUserRole:", DebugLevel.ERROR, { error: err });
        toast({
          title: "Error updating role",
          description: err instanceof Error ? err.message : "An unknown error occurred",
          variant: "destructive",
        });
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
    }
  });

  const bulkUpdateRoles = useMutation({
    mutationFn: async ({ userIds, newRole }: { userIds: string[]; newRole: UserRole }) => {
      debugLog('useRoleManagement', `Bulk updating role to ${newRole} for ${userIds.length} users`, DebugLevel.INFO);
      
      try {
        // Filter out protected admin from bulk updates
        const filteredUserIds = userIds.filter(id => !isProtectedAdmin(id) && id !== PROTECTED_ADMIN_EMAIL);
        
        if (filteredUserIds.length < userIds.length) {
          debugLog('useRoleManagement', "Protected admin users were excluded from bulk update", DebugLevel.WARN);
        }
        
        if (filteredUserIds.length === 0) {
          debugLog('useRoleManagement', "No users to update after filtering", DebugLevel.WARN);
          return { success: false, message: "No eligible users to update" };
        }
        
        const { data, error } = await supabase.functions.invoke('admin-update-roles', {
          body: { userIds: filteredUserIds, newRole }
        });
        
        if (error) {
          debugLog('useRoleManagement', "Error in bulkUpdateRoles:", DebugLevel.ERROR, { error });
          throw new Error(`Failed to update roles: ${error.message}`);
        }
        
        debugLog('useRoleManagement', "Bulk role update success:", DebugLevel.INFO, { data });
        toast({
          title: "Roles updated",
          description: `${filteredUserIds.length} users have been updated to ${newRole}`,
        });
        
        return data;
      } catch (err) {
        debugLog('useRoleManagement', "Exception in bulkUpdateRoles:", DebugLevel.ERROR, { error: err });
        toast({
          title: "Error updating roles",
          description: err instanceof Error ? err.message : "An unknown error occurred",
          variant: "destructive",
        });
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
    }
  });

  return {
    updateUserRole,
    bulkUpdateRoles
  };
}
