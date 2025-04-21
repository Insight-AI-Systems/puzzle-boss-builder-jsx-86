
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/userTypes';

// Constants
const PROTECTED_ADMIN_EMAIL = 'alan@insight-ai-systems.com';

export function useRoleManagement() {
  const queryClient = useQueryClient();

  const updateUserRole = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: UserRole }) => {
      console.log(`Updating role for user ${userId} to ${newRole}`);
      
      try {
        // Special handling for protected admin
        if (userId === PROTECTED_ADMIN_EMAIL) {
          console.log("Processing special case for protected admin");
          // You might want to add additional checks here
        }
        
        const { data, error } = await supabase.functions.invoke('admin-update-roles', {
          body: { userIds: [userId], newRole }
        });
        
        if (error) {
          console.error("Error in updateUserRole:", error);
          throw new Error(`Failed to update role: ${error.message}`);
        }
        
        console.log("Role update success:", data);
        return data;
      } catch (err) {
        console.error("Exception in updateUserRole:", err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
    }
  });

  const bulkUpdateRoles = useMutation({
    mutationFn: async ({ userIds, newRole }: { userIds: string[]; newRole: UserRole }) => {
      console.log(`Bulk updating role to ${newRole} for ${userIds.length} users`);
      
      try {
        // Check for protected admin in the list
        const hasProtectedAdmin = userIds.includes(PROTECTED_ADMIN_EMAIL);
        if (hasProtectedAdmin) {
          console.log("Bulk update includes protected admin - special handling may be required");
        }
        
        const { data, error } = await supabase.functions.invoke('admin-update-roles', {
          body: { userIds, newRole }
        });
        
        if (error) {
          console.error("Error in bulkUpdateRoles:", error);
          throw new Error(`Failed to update roles: ${error.message}`);
        }
        
        console.log("Bulk role update success:", data);
        return data;
      } catch (err) {
        console.error("Exception in bulkUpdateRoles:", err);
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
