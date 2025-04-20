
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminProfilesOptions, ProfilesResult, RpcUserData } from '@/types/adminTypes';
import { useRoleManagement } from './admin/useRoleManagement';
import { useEmailManagement } from './admin/useEmailManagement';
import { filterUserData, transformToUserProfile, extractUniqueValues } from '@/utils/admin/userDataProcessing';

export function useAdminProfiles(
  isAdmin: boolean, 
  currentUserId: string | null,
  options: AdminProfilesOptions = {}
) {
  const { page = 0, pageSize = 10, roleSortDirection = 'asc' } = options;
  
  const fetchUsers = async (): Promise<ProfilesResult> => {
    if (!isAdmin || !currentUserId) {
      console.log('Not authorized to fetch profiles or no user ID');
      return { data: [], count: 0, countries: [], categories: [] };
    }

    try {
      console.log('Fetching users with get_all_users edge function');
      const { data: rpcData, error } = await supabase.functions.invoke<RpcUserData[]>('get-all-users');

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      if (!rpcData || !Array.isArray(rpcData)) {
        console.error('Invalid response from get_all_users:', rpcData);
        return { data: [], count: 0, countries: [], categories: [] };
      }

      console.log(`Retrieved ${rpcData.length} users from get_all_users`);

      // Apply filters
      let filteredData = filterUserData(rpcData, options);
      
      // Sort by role if requested
      if (options.role || roleSortDirection) {
        filteredData.sort((a, b) => {
          const roleA = a.role || 'player';
          const roleB = b.role || 'player';
          
          if (roleSortDirection === 'asc') {
            return roleA.localeCompare(roleB);
          } else {
            return roleB.localeCompare(roleA);
          }
        });
      }
      
      const totalCount = filteredData.length;
      
      // Apply pagination
      const start = page * pageSize;
      const paginatedData = filteredData.slice(start, start + pageSize);
      
      // Transform to UserProfile format
      const profiles = paginatedData.map(transformToUserProfile);
      
      // Extract unique values
      const { countries, categories } = extractUniqueValues(rpcData);

      return { 
        data: profiles,
        count: totalCount,
        countries,
        categories
      };
      
    } catch (error) {
      console.error('Error in useAdminProfiles:', error);
      throw error;
    }
  };

  const usersQuery = useQuery({
    queryKey: ['all-users', page, pageSize, options],
    queryFn: fetchUsers,
    enabled: !!currentUserId && isAdmin,
  });

  const { updateUserRole, bulkUpdateRoles } = useRoleManagement();
  const { sendBulkEmail } = useEmailManagement();

  return {
    ...usersQuery,
    updateUserRole,
    bulkUpdateRoles,
    sendBulkEmail
  };
}
