
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { AdminProfilesOptions, ProfilesResult, RpcUserData } from '@/types/adminTypes';
import { useRoleManagement } from './admin/useRoleManagement';
import { useEmailManagement } from './admin/useEmailManagement';
import { filterUserData, transformToUserProfile, extractUniqueValues } from '@/utils/admin/userDataProcessing';
import { UserRole } from '@/types/userTypes';
import { isProtectedAdmin } from '@/constants/securityConfig';
import { debugLog, DebugLevel } from '@/utils/debug';

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
    if (!isAdmin && !currentUserId) {
      debugLog('useAdminProfiles', 'Not authorized to fetch profiles or no user ID', DebugLevel.WARN);
      return { 
        data: [], 
        count: 0, 
        countries: [], 
        categories: [],
        genders: [],
        signup_stats: []
      };
    }

    // Check if current user is the protected admin
    const { data: userData } = await supabase.auth.getUser();
    const isProtectedAdminUser = isProtectedAdmin(userData?.user?.email);
    
    if (isProtectedAdminUser) {
      debugLog('useAdminProfiles', 'Protected admin detected, using direct profile fetch', DebugLevel.INFO, {
        email: userData?.user?.email
      });
    }

    try {
      debugLog('useAdminProfiles', 'Fetching users with get-all-users edge function', DebugLevel.INFO);
      const response = await supabase.functions.invoke<RpcUserData[]>('get-all-users', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.error) {
        debugLog('useAdminProfiles', 'Error fetching users:', DebugLevel.ERROR, { error: response.error });
        throw response.error;
      }
      
      const rpcData = response.data;

      if (!rpcData || !Array.isArray(rpcData)) {
        debugLog('useAdminProfiles', 'Invalid response from get-all-users:', DebugLevel.ERROR, { data: rpcData });
        
        // Fallback to direct database query if edge function fails
        debugLog('useAdminProfiles', 'Attempting fallback to direct profiles query', DebugLevel.INFO);
        
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('profiles')
          .select('id, username, bio, avatar_url, role, credits, created_at, updated_at, email')
          .order('username', { ascending: true });
        
        if (fallbackError) {
          debugLog('useAdminProfiles', 'Fallback query failed', DebugLevel.ERROR, { error: fallbackError });
          return { 
            data: [], 
            count: 0, 
            countries: [], 
            categories: [],
            genders: [],
            signup_stats: []
          };
        }
        
        // Transform direct query results to expected format
        const profiles = fallbackData.map(profile => ({
          id: profile.id,
          email: profile.email || null,
          display_name: profile.username || 'Anonymous User',
          bio: profile.bio || null,
          avatar_url: profile.avatar_url,
          role: (profile.role || 'player') as UserRole,
          country: null,
          categories_played: [],
          credits: profile.credits || 0,
          achievements: [],
          referral_code: null,
          created_at: profile.created_at,
          updated_at: profile.updated_at || profile.created_at,
          last_sign_in: null
        }));
        
        debugLog('useAdminProfiles', 'Successfully retrieved profiles via fallback', DebugLevel.INFO, {
          count: profiles.length
        });
        
        return {
          data: profiles,
          count: profiles.length,
          countries: [],
          categories: [],
          genders: [],
          signup_stats: []
        };
      }

      debugLog('useAdminProfiles', `Retrieved ${rpcData.length} users from get-all-users`, DebugLevel.INFO);

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

      debugLog('useAdminProfiles', 'Successfully processed user data', DebugLevel.INFO, {
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
      debugLog('useAdminProfiles', 'Error in useAdminProfiles:', DebugLevel.ERROR, { error });
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
      queryKey: ['all-users', page, pageSize, options, lastLoginSortDirection, userType],
      queryFn: fetchUsers,
      enabled: !!currentUserId && isAdmin,
      retry: 3,
      retryDelay: (attempt) => Math.min(attempt > 1 ? 2000 * 2 ** attempt : 1000, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  } catch (err) {
    debugLog('useAdminProfiles', 'Error creating query:', DebugLevel.ERROR, { error: err });
    usersQuery = {
      data: null,
      isLoading: false,
      error: err,
      refetch: () => Promise.resolve()
    };
  }

  // Role management mutations
  const updateUserRole = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: UserRole }) => {
      debugLog('useAdminProfiles', `Updating role for user ${userId} to ${newRole}`, DebugLevel.INFO);
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
      debugLog('useAdminProfiles', `Bulk updating roles for ${userIds.length} users to ${newRole}`, DebugLevel.INFO);
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
      debugLog('useAdminProfiles', `Sending email to ${userIds.length} users`, DebugLevel.INFO);
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
