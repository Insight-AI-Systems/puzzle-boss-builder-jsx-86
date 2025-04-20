
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
        .select('id, username, bio, avatar_url, role, country, categories_played, credits, created_at, updated_at')
        .single();
      
      if (error) throw error;
      
      const updatedUserProfile: UserProfile = {
        id: data.id,
        display_name: data.username || null,
        bio: data.bio || null,
        avatar_url: data.avatar_url,
        role: (data.role || 'player') as UserRole,
        country: data.country || null,
        categories_played: data.categories_played || [],
        credits: data.credits || 0,
        achievements: [],
        referral_code: null,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString()
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
