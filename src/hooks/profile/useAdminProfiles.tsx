
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/userTypes';

export function useAdminProfiles(isAdmin: boolean, currentUserId: string | null) {
  return useQuery({
    queryKey: ['all-profiles'],
    queryFn: async () => {
      if (!isAdmin) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(profile => ({
        id: profile.id,
        display_name: profile.username || null,
        bio: null,
        avatar_url: profile.avatar_url,
        role: (profile.role || 'player'),
        credits: profile.credits || 0,
        achievements: [],
        referral_code: null,
        created_at: profile.created_at || new Date().toISOString(),
        updated_at: profile.updated_at || new Date().toISOString()
      } as UserProfile));
    },
    enabled: isAdmin && !!currentUserId,
  });
}

