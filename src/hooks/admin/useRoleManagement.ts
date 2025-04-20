
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/userTypes';

export function useRoleManagement() {
  const queryClient = useQueryClient();

  const updateUserRole = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: UserRole }) => {
      console.log(`Updating role for user ${userId} to ${newRole}`);
      
      const { data, error } = await supabase.functions.invoke('admin-update-roles', {
        body: { userIds: [userId], newRole }
      });
      
      if (error) {
        console.error("Error in updateUserRole:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
    },
    onError: (error) => {
      console.error("Role update mutation error:", error);
    }
  });

  const bulkUpdateRoles = useMutation({
    mutationFn: async ({ userIds, newRole }: { userIds: string[]; newRole: UserRole }) => {
      console.log(`Bulk updating role to ${newRole} for ${userIds.length} users`);
      
      const { data, error } = await supabase.functions.invoke('admin-update-roles', {
        body: { userIds, newRole }
      });
      
      if (error) {
        console.error("Error in bulkUpdateRoles:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
    },
    onError: (error) => {
      console.error("Bulk role update mutation error:", error);
    }
  });

  return {
    updateUserRole,
    bulkUpdateRoles
  };
}
