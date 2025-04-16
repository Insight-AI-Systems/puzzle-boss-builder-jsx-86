
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from '@/types/userTypes';
import { useToast } from '@/hooks/use-toast';

export function useRoleManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateUserRole = useMutation({
    mutationFn: async ({ targetUserId, newRole }: { targetUserId: string; newRole: UserRole }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', targetUserId)
        .select();
      
      if (error) throw error;
      
      const updatedUserProfile: UserProfile = {
        id: data[0].id,
        display_name: data[0].username || null,
        bio: null,
        avatar_url: data[0].avatar_url,
        role: (data[0].role || 'player'),
        credits: data[0].credits || 0,
        achievements: [],
        referral_code: null,
        created_at: data[0].created_at || new Date().toISOString(),
        updated_at: data[0].updated_at || new Date().toISOString()
      };
      
      return updatedUserProfile;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['profile', variables.targetUserId], data);
      toast({
        title: 'Role updated',
        description: `User role has been updated to ${data.role}.`,
        duration: 3000,
      });
    },
    onError: (error) => {
      toast({
        title: 'Role update failed',
        description: `Error: ${error instanceof Error ? error.message : 'You do not have permission to update this role.'}`,
        variant: 'destructive',
        duration: 5000,
      });
    },
  });

  return { updateUserRole };
}

