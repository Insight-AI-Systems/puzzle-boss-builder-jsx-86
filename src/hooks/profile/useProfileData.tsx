
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from '@/types/userTypes';

export function useProfileData(profileId: string | null) {
  return useQuery({
    queryKey: ['profile', profileId],
    queryFn: async () => {
      if (!profileId) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();
      
      if (error) throw error;
      
      console.log('Profile data retrieved:', data);
      
      // Ensure we handle potential missing fields from the database
      const userProfile: UserProfile = {
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
      
      return userProfile;
    },
    enabled: !!profileId,
  });
}
