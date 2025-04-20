
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from '@/types/userTypes';

export interface AdminProfilesOptions {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  dateRange?: { from?: Date; to?: Date };
  country?: string | null;
  category?: string | null;
  role?: UserRole | null;
  roleSortDirection?: 'asc' | 'desc';
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
  const { 
    page = 0, 
    pageSize = 10, 
    searchTerm = '',
    dateRange,
    country,
    category,
    role,
    roleSortDirection = 'asc'
  } = options;

  return useQuery({
    queryKey: ['profiles', page, pageSize, searchTerm, dateRange, country, category, role, roleSortDirection],
    queryFn: async () => {
      if (!isAdmin && !currentUserId) {
        console.log('Not authorized to fetch profiles or no user ID');
        return { data: [], count: 0 } as ProfilesResult;
      }

      try {
        // Instead of using the RPC that's causing TypeScript issues,
        // we'll use a direct query approach
        let query = supabase
          .from('profiles')
          .select('*', { count: 'exact' });
          
        // Apply filters
        if (searchTerm) {
          query = query.or(`username.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
        }
        
        // Apply date range filter if provided
        if (dateRange?.from) {
          query = query.gte('created_at', dateRange.from.toISOString());
        }
        
        if (dateRange?.to) {
          query = query.lte('created_at', dateRange.to.toISOString());
        }
        
        // Apply country filter if provided
        if (country) {
          query = query.eq('country', country);
        }
        
        // Apply role filter if provided  
        if (role) {
          query = query.eq('role', role);
        }
        
        // Apply ordering
        query = query.order('role', { ascending: roleSortDirection === 'asc' });
        
        // Apply pagination
        query = query
          .range(page * pageSize, (page + 1) * pageSize - 1);
        
        const { data, error, count } = await query;

        if (error) {
          console.error('Error fetching filtered users:', error);
          throw error;
        }

        // Transform the database rows into UserProfile objects
        const profiles = (data || []).map(profile => {
          return {
            id: profile.id,
            display_name: profile.username || 'Anonymous User',
            bio: profile.bio || null,
            avatar_url: profile.avatar_url,
            role: (profile.role || 'player') as UserRole,
            country: profile.country || null,
            categories_played: Array.isArray(profile.categories_played) ? profile.categories_played : [],
            credits: profile.credits || 0,
            achievements: [],
            referral_code: null,
            created_at: profile.created_at,
            updated_at: profile.updated_at || profile.created_at
          } as UserProfile;
        });

        // For category filtering, we need to do it post-query since it's an array
        const filteredProfiles = category 
          ? profiles.filter(p => p.categories_played?.includes(category))
          : profiles;

        return { 
          data: filteredProfiles,
          count: count || filteredProfiles.length
        } as ProfilesResult;
        
      } catch (error) {
        console.error('Error in useAdminProfiles:', error);
        return { data: [], count: 0 } as ProfilesResult;
      }
    },
    enabled: !!currentUserId,
  });
}
