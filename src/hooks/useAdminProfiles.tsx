
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from '@/types/userTypes';
import { AdminProfilesOptions } from './useUserProfile';

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
        return { data: [], count: 0 };
      }

      try {
        const { data: filteredData, error } = await supabase.rpc('filter_users', {
          start_date: dateRange?.from?.toISOString(),
          end_date: dateRange?.to?.toISOString(),
          user_country: country,
          category: category,
          user_role: role,
          sort_direction: roleSortDirection
        });

        if (error) {
          console.error('Error fetching filtered users:', error);
          throw error;
        }

        const profiles = filteredData.map(profile => ({
          id: profile.id,
          display_name: profile.display_name || 'Anonymous User',
          bio: null,
          avatar_url: profile.avatar_url,
          role: (profile.role || 'player') as UserRole,
          country: profile.country,
          categories_played: profile.categories_played || [],
          credits: 0,
          achievements: [],
          referral_code: null,
          created_at: profile.created_at,
          updated_at: profile.created_at
        }));

        return { 
          data: profiles,
          count: profiles.length
        };
      } catch (error) {
        console.error('Error in useAdminProfiles:', error);
        return { data: [], count: 0 };
      }
    },
    enabled: !!currentUserId,
  });
}
