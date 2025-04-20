
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from '@/types/userTypes';

interface ProfileUpdateData {
  username?: string;
  bio?: string;
  avatar_url?: string | null;
}

export function useProfileMutation(userId: string | null) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profileData: ProfileUpdateData) => {
      if (!userId) throw new Error('No user ID provided');
      
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          username: profileData.username,
          bio: profileData.bio,
          avatar_url: profileData.avatar_url,
          updated_at: new Date().toISOString()
        })
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
        role: (data.role || 'player') as UserRole,
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
      queryClient.setQueryData(['profile', userId], data);
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    }
  });
}
