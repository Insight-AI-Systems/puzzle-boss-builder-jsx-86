
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
        // Instead of using an RPC that doesn't exist yet, use search_and_sync_users
        // which will search users and ensure profiles are created
        const { data, error } = await supabase.rpc('search_and_sync_users', {
          search_term: searchTerm
        });

        if (error) {
          console.error('Error fetching users:', error);
          throw error;
        }

        // Apply client-side filtering until we implement a more comprehensive RPC function
        let filteredData = [...data];
        
        // Date range filtering
        if (dateRange?.from) {
          const fromDate = new Date(dateRange.from);
          filteredData = filteredData.filter(user => {
            const userDate = new Date(user.created_at);
            return userDate >= fromDate;
          });
        }
        
        if (dateRange?.to) {
          const toDate = new Date(dateRange.to);
          filteredData = filteredData.filter(user => {
            const userDate = new Date(user.created_at);
            return userDate <= toDate;
          });
        }
        
        // Role filtering
        if (role) {
          filteredData = filteredData.filter(user => user.role === role);
        }
        
        // Role sorting
        filteredData.sort((a, b) => {
          if (roleSortDirection === 'asc') {
            return a.role.localeCompare(b.role);
          } else {
            return b.role.localeCompare(a.role);
          }
        });
        
        // Pagination
        const start = page * pageSize;
        const paginatedData = filteredData.slice(start, start + pageSize);
        
        // Transform the response into UserProfile objects
        const profiles = paginatedData.map(user => ({
          id: user.id,
          display_name: user.display_name || 'Anonymous User',
          bio: null,
          avatar_url: null,
          role: (user.role || 'player') as UserRole,
          country: null,
          categories_played: [],
          credits: 0,
          achievements: [],
          referral_code: null,
          created_at: user.created_at,
          updated_at: user.created_at
        }));

        return { 
          data: profiles,
          count: filteredData.length
        } as ProfilesResult;
        
      } catch (error) {
        console.error('Error in useAdminProfiles:', error);
        throw error;
      }
    },
    enabled: !!currentUserId && isAdmin,
  });
}
