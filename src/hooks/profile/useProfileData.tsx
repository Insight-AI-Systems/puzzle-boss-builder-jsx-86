
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from '@/types/userTypes';

export function useProfileData(userId: string | null) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
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
        updated_at: data.updated_at || data.created_at
      };
      
      return profile;
    },
    enabled: !!userId,
  });
}
