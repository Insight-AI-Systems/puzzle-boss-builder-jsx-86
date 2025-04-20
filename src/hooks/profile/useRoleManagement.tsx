
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from '@/types/userTypes';

export function useRoleManagement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: UserRole }) => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      const { data, error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      const profile: UserProfile = {
        id: data.id,
        email: userData.user?.email || null,
        display_name: data.username || null,
        bio: data.bio || null,
        avatar_url: data.avatar_url || null,
        role: data.role as UserRole,
        country: null,
        categories_played: [],
        credits: data.credits || 0,
        achievements: [],
        referral_code: null,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      return profile;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile', data.id], data);
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    }
  });
}
