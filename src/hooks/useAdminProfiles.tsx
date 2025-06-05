
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { AdminProfilesOptions, ProfilesResult, RpcUserData } from '@/types/adminTypes';
import { useRoleManagement } from './admin/useRoleManagement';
import { useEmailManagement } from './admin/useEmailManagement';
import { filterUserData, transformToUserProfile, extractUniqueValues } from '@/utils/admin/userDataProcessing';

export function useAdminProfiles(
  isAdmin: boolean, 
  currentUserId: string | null,
  options: AdminProfilesOptions = {}
) {
  const { page = 0, pageSize = 10, roleSortDirection = 'asc', lastLoginSortDirection } = options;
  
  const fetchUsers = async (): Promise<ProfilesResult> => {
    if (!isAdmin || !currentUserId) {
      console.log('Not authorized to fetch profiles or no user ID');
      return { 
        data: [], 
        count: 0, 
        countries: [], 
        categories: [],
        genders: [],
        signup_stats: []
      };
    }

    try {
      console.log('Fetching users with get-all-users edge function');
      
      // Get the current session to include auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No valid session found');
      }

      const { data: rpcData, error } = await supabase.functions.invoke<RpcUserData[]>('get-all-users', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      if (!rpcData || !Array.isArray(rpcData)) {
        console.error('Invalid response from get-all-users:', rpcData);
        return { 
          data: [], 
          count: 0, 
          countries: [], 
          categories: [],
          genders: [],
          signup_stats: []
        };
      }

      console.log(`Retrieved ${rpcData.length} users from get-all-users`);

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
      
      // Sort by last login if requested
      if (lastLoginSortDirection) {
        filteredData.sort((a, b) => {
          const dateA = a.last_sign_in ? new Date(a.last_sign_in).getTime() : 0;
          const dateB = b.last_sign_in ? new Date(b.last_sign_in).getTime() : 0;
          return lastLoginSortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        });
      }
      
      const totalCount = filteredData.length;
      
      // Apply pagination
      const start = page * pageSize;
      const paginatedData = filteredData.slice(start, start + pageSize);
      
      // Transform to UserProfile format
      const profiles = paginatedData.map(transformToUserProfile);
      
      // Extract unique values
      const { countries, categories, genders } = extractUniqueValues(rpcData);

      // Calculate signup stats by month
      const signupStats = calculateSignupStats(rpcData);

      return { 
        data: profiles,
        count: totalCount,
        countries,
        categories,
        genders: genders || [],
        signup_stats: signupStats
      };
      
    } catch (error) {
      console.error('Error in useAdminProfiles:', error);
      throw error;
    }
  };

  // Calculate signup statistics by month
  const calculateSignupStats = (userData: RpcUserData[]) => {
    const monthStats: { [key: string]: number } = {};
    
    userData.forEach(user => {
      if (user.created_at) {
        const date = new Date(user.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        monthStats[monthKey] = (monthStats[monthKey] || 0) + 1;
      }
    });
    
    return Object.entries(monthStats)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));
  };

  // Use try-catch to handle potential React Query context errors
  let usersQuery;
  try {
    usersQuery = useQuery({
      queryKey: ['all-users', page, pageSize, options, lastLoginSortDirection],
      queryFn: fetchUsers,
      enabled: !!currentUserId && isAdmin,
      retry: 1,
    });
  } catch (error) {
    console.error('React Query error in useAdminProfiles:', error);
    // Provide a fallback empty result if useQuery fails
    usersQuery = {
      data: { 
        data: [], 
        count: 0, 
        countries: [], 
        categories: [],
        genders: [],
        signup_stats: [] 
      },
      isLoading: false,
      error: error,
      refetch: () => Promise.resolve()
    };
  }

  // Get role management functions safely
  let roleManagementFns;
  try {
    roleManagementFns = useRoleManagement();
  } catch (error) {
    console.error('React Query error in useRoleManagement:', error);
    roleManagementFns = {
      updateUserRole: null,
      bulkUpdateRoles: null
    };
  }

  // Get email management functions safely
  let emailManagementFns;
  try {
    emailManagementFns = useEmailManagement();
  } catch (error) {
    console.error('React Query error in useEmailManagement:', error);
    emailManagementFns = {
      sendBulkEmail: null
    };
  }

  return {
    ...usersQuery,
    updateUserRole: roleManagementFns?.updateUserRole,
    bulkUpdateRoles: roleManagementFns?.bulkUpdateRoles,
    sendBulkEmail: emailManagementFns?.sendBulkEmail
  };
}
