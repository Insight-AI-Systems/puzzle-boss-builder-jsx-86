
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/userTypes';

export interface AdminProfilesOptions {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
}

export interface ProfilesResult {
  data: UserProfile[];
  count: number;
}

export function useAdminProfiles(
  isAdmin: boolean, 
  currentUserId: string | null,
  options: AdminProfilesOptions = {}
) {
  const { page = 0, pageSize = 10, searchTerm = '' } = options;
  
  return useQuery({
    queryKey: ['profiles', page, pageSize, searchTerm],
    queryFn: async () => {
      if (!isAdmin && !currentUserId) {
        console.log('Not authorized to fetch profiles or no user ID');
        return { data: [], count: 0 } as ProfilesResult;
      }
      
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' });
      
      // Add search filter if searchTerm is provided
      if (searchTerm) {
        query = query.or(`username.ilike.%${searchTerm}%,id.ilike.%${searchTerm}%`);
      }
      
      // Add pagination
      const from = page * pageSize;
      const to = from + pageSize - 1;
      
      const { data, error, count } = await query
        .range(from, to)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching profiles:', error);
        throw error;
      }
      
      const profiles = data?.map(profile => ({
        id: profile.id,
        display_name: profile.username || null,
        bio: profile.bio || null,
        avatar_url: profile.avatar_url,
        role: profile.role || 'player',
        credits: profile.credits || 0,
        achievements: [],
        referral_code: null,
        created_at: profile.created_at || new Date().toISOString(),
        updated_at: profile.updated_at || new Date().toISOString()
      } as UserProfile)) || [];
      
      return { data: profiles, count: count || 0 } as ProfilesResult;
    },
    enabled: !!currentUserId,
  });
}
