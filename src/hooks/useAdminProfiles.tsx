
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from '@/types/userTypes';

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

      try {
        // If email search, try direct profile search first
        if (searchTerm && searchTerm.includes('@')) {
          console.log('Email search detected:', searchTerm);
          
          const { data: profileData, count, error: profileError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact' })
            .eq('email', searchTerm)
            .range(page * pageSize, (page * pageSize) + pageSize - 1);
          
          if (profileError) {
            console.error('Error searching profiles by email:', profileError);
          } else if (profileData && profileData.length > 0) {
            console.log('Found profiles by exact email match:', profileData.length);
            
            const profiles = profileData.map(profile => ({
              id: profile.id,
              display_name: profile.username || profile.email || 'Anonymous User',
              bio: profile.bio || null,
              avatar_url: profile.avatar_url,
              role: (profile.role || 'player') as UserRole,
              credits: profile.credits || 0,
              achievements: [],
              referral_code: null,
              created_at: profile.created_at || new Date().toISOString(),
              updated_at: profile.updated_at || new Date().toISOString()
            } as UserProfile));
            
            return { 
              data: profiles, 
              count: count || profiles.length 
            } as ProfilesResult;
          }
          
          // If no direct match, try auth users search via search_and_sync_users function
          console.log('No exact profile match, attempting to search auth users');
          
          try {
            const { data: searchResults, error: searchError } = await supabase
              .rpc('search_and_sync_users', { search_term: searchTerm });
              
            if (searchError) {
              console.error('Error in search_and_sync_users:', searchError);
            } else if (searchResults && Array.isArray(searchResults) && searchResults.length > 0) {
              console.log('Found users via search_and_sync_users:', searchResults);
              
              // Map the search results to UserProfile
              const profiles = searchResults.map(result => ({
                id: result.id,
                display_name: result.display_name || result.email || 'Anonymous User',
                bio: null,
                avatar_url: null,
                role: (result.role || 'player') as UserRole,
                credits: 0,
                achievements: [],
                referral_code: null,
                created_at: result.created_at || new Date().toISOString(),
                updated_at: result.created_at || new Date().toISOString()
              } as UserProfile));
              
              return {
                data: profiles,
                count: profiles.length
              } as ProfilesResult;
            }
          } catch (searchErr) {
            console.error('Exception in search_and_sync_users:', searchErr);
          }
          
          // Last resort: fuzzy search in profiles table
          console.log('Falling back to fuzzy profile search');
          const { data: fuzzyData, count: fuzzyCount, error: fuzzyError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact' })
            .ilike('email', `%${searchTerm}%`)
            .range(page * pageSize, (page * pageSize) + pageSize - 1);
            
          if (fuzzyError) {
            console.error('Error in fuzzy profile search:', fuzzyError);
          } else if (fuzzyData && fuzzyData.length > 0) {
            console.log('Found profiles by fuzzy email match:', fuzzyData.length);
            
            const profiles = fuzzyData.map(profile => ({
              id: profile.id,
              display_name: profile.username || profile.email || 'Anonymous User',
              bio: profile.bio || null,
              avatar_url: profile.avatar_url,
              role: (profile.role || 'player') as UserRole,
              credits: profile.credits || 0,
              achievements: [],
              referral_code: null,
              created_at: profile.created_at || new Date().toISOString(),
              updated_at: profile.updated_at || new Date().toISOString()
            } as UserProfile));
            
            return { 
              data: profiles, 
              count: fuzzyCount || profiles.length 
            } as ProfilesResult;
          }
        }
        
        // General search across all profiles (fallback or non-email search)
        if (searchTerm) {
          console.log('Performing general search with term:', searchTerm);
          const { data: profileData, count, error: profileError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact' })
            .or(`username.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
            .range(page * pageSize, (page * pageSize) + pageSize - 1);
            
          if (profileError) {
            console.error('Error in general profile search:', profileError);
            throw profileError;
          }
          
          const profiles = profileData?.map(profile => ({
            id: profile.id,
            display_name: profile.username || profile.email || 'Anonymous User',
            bio: profile.bio || null,
            avatar_url: profile.avatar_url,
            role: (profile.role || 'player') as UserRole,
            credits: profile.credits || 0,
            achievements: [],
            referral_code: null,
            created_at: profile.created_at || new Date().toISOString(),
            updated_at: profile.updated_at || new Date().toISOString()
          } as UserProfile)) || [];
          
          return { data: profiles, count: count || 0 } as ProfilesResult;
        }
        
        // Default: fetch all profiles with pagination
        console.log('Fetching paginated profiles');
        const { data, error, count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact' })
          .range(page * pageSize, (page * pageSize) + pageSize - 1)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching profiles:', error);
          throw error;
        }
        
        const profiles = data?.map(profile => ({
          id: profile.id,
          display_name: profile.username || profile.email || 'Anonymous User',
          bio: profile.bio || null,
          avatar_url: profile.avatar_url,
          role: (profile.role || 'player') as UserRole,
          credits: profile.credits || 0,
          achievements: [],
          referral_code: null,
          created_at: profile.created_at || new Date().toISOString(),
          updated_at: profile.updated_at || new Date().toISOString()
        } as UserProfile)) || [];
        
        return { data: profiles, count: count || 0 } as ProfilesResult;
      } catch (error) {
        console.error('Unhandled error in useAdminProfiles:', error);
        
        // Final fallback - empty result
        return { 
          data: [], 
          count: 0 
        } as ProfilesResult;
      }
    },
    enabled: !!currentUserId,
  });
}
