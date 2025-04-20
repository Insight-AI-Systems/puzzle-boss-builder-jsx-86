
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
        // If searching for an email, try direct email match first
        if (searchTerm && searchTerm.includes('@')) {
          console.log('Email search detected:', searchTerm);
          
          // Try exact email match in profiles table
          const { data: exactProfileData, count: exactCount, error: exactProfileError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact' })
            .ilike('email', searchTerm)
            .range(page * pageSize, (page * pageSize) + pageSize - 1);
          
          if (exactProfileError) {
            console.error('Error searching profiles by exact email:', exactProfileError);
          } else if (exactProfileData && exactProfileData.length > 0) {
            console.log('Found profiles by exact email match:', exactProfileData.length);
            
            const profiles = exactProfileData.map(profile => ({
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
              count: exactCount || profiles.length 
            } as ProfilesResult;
          }
          
          // Try auth.users lookup via RPC (requires function in Supabase)
          try {
            console.log('Trying auth users lookup via RPC for:', searchTerm);
            
            const { data: authUserResults, error: authUserError } = await supabase
              .rpc('search_users_by_email', { search_email: searchTerm });
              
            if (authUserError) {
              console.error('Error in auth users lookup:', authUserError);
            } else if (authUserResults && Array.isArray(authUserResults) && authUserResults.length > 0) {
              console.log('Found users via auth lookup:', authUserResults.length);
              
              // Map the search results to UserProfile
              const profiles = authUserResults.map(result => ({
                id: result.id,
                display_name: result.email || 'Anonymous User',
                bio: null,
                avatar_url: null,
                role: 'player' as UserRole,
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
          } catch (authLookupErr) {
            console.error('Exception in auth users lookup:', authLookupErr);
          }
          
          // Try fuzzy email search as fallback
          console.log('Falling back to fuzzy email search for:', searchTerm);
          const { data: fuzzyData, count: fuzzyCount, error: fuzzyError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact' })
            .ilike('email', `%${searchTerm}%`)
            .range(page * pageSize, (page * pageSize) + pageSize - 1);
            
          if (fuzzyError) {
            console.error('Error in fuzzy email search:', fuzzyError);
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
        
        // General search across all profiles (for names or partial email matches)
        if (searchTerm) {
          console.log('Performing general search with term:', searchTerm);
          // Search by username, email, or display_name
          const { data: profileData, count, error: profileError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact' })
            .or(`username.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
            .range(page * pageSize, (page * pageSize) + pageSize - 1);
            
          if (profileError) {
            console.error('Error in general profile search:', profileError);
            throw profileError;
          }
          
          if (profileData && profileData.length > 0) {
            console.log('Found profiles in general search:', profileData.length);
            
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
            
            return { data: profiles, count: count || profiles.length } as ProfilesResult;
          } else {
            console.log('No profiles found in general search for:', searchTerm);
          }
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
