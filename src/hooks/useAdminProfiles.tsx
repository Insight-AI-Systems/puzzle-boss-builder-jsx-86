
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

      if (searchTerm) {
        try {
          // Use the search_and_sync_users function when there's a search term
          console.log('Searching for users with term:', searchTerm);
          const { data: searchResults, error: searchError } = await supabase
            .rpc('search_and_sync_users', { search_term: searchTerm });

          if (searchError) {
            console.error('Error searching users:', searchError);
            throw searchError;
          }

          console.log('Search results:', searchResults);

          if (!searchResults || searchResults.length === 0) {
            console.log('No search results found, trying direct profile search');
            // Try searching directly in profiles table as a fallback
            const { data: profileData, count, error: profileError } = await supabase
              .from('profiles')
              .select('*', { count: 'exact' })
              .or(`username.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
              .range(page * pageSize, (page * pageSize) + pageSize - 1);
              
            if (profileError) {
              console.error('Error in profile fallback search:', profileError);
              throw profileError;
            }
            
            const profiles = profileData?.map(profile => ({
              id: profile.id,
              display_name: profile.username || profile.email || 'Anonymous User',
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
          }

          // Map the search results to UserProfile type
          const profiles = searchResults.map(result => ({
            id: result.id,
            display_name: result.display_name || result.email || 'Anonymous User',
            bio: null,
            avatar_url: null,
            role: result.role || 'player',
            credits: 0,
            achievements: [],
            referral_code: null,
            created_at: result.created_at,
            updated_at: result.created_at
          } as UserProfile));

          return {
            data: profiles,
            count: profiles.length
          } as ProfilesResult;
        } catch (error) {
          console.error('Error in search function:', error);
          
          // Fallback to regular profile search if all else fails
          console.log('Falling back to simple profile search');
          const { data: fallbackData, count: fallbackCount, error: fallbackError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact' })
            .range(page * pageSize, (page * pageSize) + pageSize - 1);
            
          if (fallbackError) {
            console.error('Error in fallback profile search:', fallbackError);
            throw fallbackError;
          }
          
          const profiles = fallbackData?.map(profile => ({
            id: profile.id,
            display_name: profile.username || profile.email || 'Anonymous User',
            bio: profile.bio || null,
            avatar_url: profile.avatar_url,
            role: profile.role || 'player',
            credits: profile.credits || 0,
            achievements: [],
            referral_code: null,
            created_at: profile.created_at || new Date().toISOString(),
            updated_at: profile.updated_at || new Date().toISOString()
          } as UserProfile)) || [];
          
          return { 
            data: profiles, 
            count: fallbackCount || 0 
          } as ProfilesResult;
        }
      }
      
      // If no search term, fetch regular paginated profiles
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' });
      
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
        display_name: profile.username || profile.email || null,
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
