
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { AdminProfilesOptions, ProfilesResult, RpcUserData } from '@/types/adminTypes';
import { useRoleManagement } from './admin/useRoleManagement';
import { useEmailManagement } from './admin/useEmailManagement';
import { filterUserData, transformToUserProfile, extractUniqueValues } from '@/utils/admin/userDataProcessing';
import { UserRole } from '@/types/userTypes';

// Define admin roles for filtering
const ADMIN_ROLES = ['super_admin', 'admin', 'category_manager', 'social_media_manager', 'partner_manager', 'cfo'];

export function useAdminProfiles(
  isAdmin: boolean, 
  currentUserId: string | null,
  options: AdminProfilesOptions = {}
) {
  const { page = 0, pageSize = 10, roleSortDirection = 'asc', lastLoginSortDirection, userType } = options;
  const queryClient = useQueryClient();
  
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
      const response = await supabase.functions.invoke<RpcUserData[]>('get-all-users', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.error) {
        console.error('Error fetching users:', response.error);
        throw response.error;
      }
      
      const rpcData = response.data;

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

      console.log('Successfully processed user data', {
        totalCount,
        paginatedCount: paginatedData.length,
        countries: countries.length,
        categories: categories.length,
        genders: genders ? genders.length : 0,
        userType
      });

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
  const usersQuery = useQuery({
    queryKey: ['all-users', page, pageSize, options, lastLoginSortDirection, userType],
    queryFn: fetchUsers,
    enabled: !!currentUserId && isAdmin,
    retry: 3,
    retryDelay: (attempt) => Math.min(attempt > 1 ? 2000 * 2 ** attempt : 1000, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Role management mutations
  const updateUserRole = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: UserRole }) => {
      console.log(`Updating role for user ${userId} to ${newRole}`);
      const { data, error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
    },
  });

  const bulkUpdateRoles = useMutation({
    mutationFn: async ({ userIds, newRole }: { userIds: string[]; newRole: UserRole }) => {
      console.log(`Bulk updating roles for ${userIds.length} users to ${newRole}`);
      // Use Promise.all to handle multiple updates
      const promises = userIds.map(userId =>
        supabase
          .from('profiles')
          .update({ role: newRole })
          .eq('id', userId)
      );
      
      await Promise.all(promises);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
    },
  });

  // Email management mutation
  const sendBulkEmail = useMutation({
    mutationFn: async ({ userIds, subject, body }: { userIds: string[]; subject: string; body: string }) => {
      console.log(`Sending email to ${userIds.length} users`);
      const { data, error } = await supabase.functions.invoke('send-bulk-email', {
        body: { userIds, subject, body }
      });
      
      if (error) throw error;
      return data;
    }
  });

  return {
    ...usersQuery,
    updateUserRole,
    bulkUpdateRoles,
    sendBulkEmail
  };
}
