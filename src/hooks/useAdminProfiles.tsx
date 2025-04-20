
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from '@/types/userTypes';
import { DateRange } from 'react-day-picker';

export interface AdminProfilesOptions {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  dateRange?: DateRange;
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
    role,
    roleSortDirection = 'asc'
  } = options;

  return useQuery({
    queryKey: ['profiles', page, pageSize, searchTerm, dateRange, role, roleSortDirection],
    queryFn: async () => {
      if (!isAdmin || !currentUserId) {
        console.log('Not authorized to fetch profiles or no user ID');
        return { data: [], count: 0 } as ProfilesResult;
      }

      try {
        const { data, error } = await supabase.rpc('get_all_users', {
          page_number: page,
          page_size: pageSize,
          search_term: searchTerm,
          from_date: dateRange?.from,
          to_date: dateRange?.to,
          role_filter: role,
          sort_direction: roleSortDirection
        });

        if (error) {
          console.error('Error fetching users:', error);
          throw error;
        }

        // Transform the response into UserProfile objects
        const profiles = data.map(row => ({
          id: row.id,
          display_name: row.username || 'Anonymous User',
          bio: row.bio || null,
          avatar_url: row.avatar_url,
          role: (row.role || 'player') as UserRole,
          country: row.country || null,
          categories_played: row.categories_played || [],
          credits: row.credits || 0,
          achievements: [],
          referral_code: null,
          created_at: row.created_at,
          updated_at: row.updated_at || row.created_at
        }));

        return { 
          data: profiles,
          count: data[0]?.total_count || 0
        } as ProfilesResult;
        
      } catch (error) {
        console.error('Error in useAdminProfiles:', error);
        throw error;
      }
    },
    enabled: !!currentUserId,
  });
}
