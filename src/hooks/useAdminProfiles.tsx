
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  country?: string | null;
  category?: string | null;
}

export interface ProfilesResult {
  data: UserProfile[];
  count: number;
  countries: string[];
  categories: string[];
}

// Define a type for the user data returned by the get_all_users RPC
interface RpcUserData {
  id: string;
  email: string;
  created_at: string;
  display_name: string | null;
  role: UserRole | null;
  country: string | null;
  categories_played: string[] | null;
}

export function useAdminProfiles(
  isAdmin: boolean, 
  currentUserId: string | null,
  options: AdminProfilesOptions = {}
) {
  const queryClient = useQueryClient();
  const { 
    page = 0, 
    pageSize = 10, 
    searchTerm = '',
    dateRange,
    role,
    roleSortDirection = 'asc',
    country,
    category
  } = options;

  const fetchUsers = async (): Promise<ProfilesResult> => {
    if (!isAdmin || !currentUserId) {
      console.log('Not authorized to fetch profiles or no user ID');
      return { data: [], count: 0, countries: [], categories: [] };
    }

    try {
      console.log('Fetching users with get_all_users RPC');
      // Call the get_all_users RPC function - explicitly cast the response type
      const { data: rpcData, error } = await supabase.rpc<RpcUserData[], void>('get_all_users');

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      if (!rpcData || !Array.isArray(rpcData)) {
        console.error('Invalid response from get_all_users:', rpcData);
        return { data: [], count: 0, countries: [], categories: [] };
      }

      console.log(`Retrieved ${rpcData.length} users from get_all_users`);

      const uniqueCountries = new Set<string>();
      const uniqueCategories = new Set<string>();
      
      // Collect unique countries and categories
      rpcData.forEach(user => {
        if (user.country) uniqueCountries.add(user.country);
        if (user.categories_played && Array.isArray(user.categories_played)) {
          user.categories_played.forEach(cat => uniqueCategories.add(cat));
        }
      });

      let filteredData = [...rpcData];
      
      // Apply filters
      if (searchTerm) {
        filteredData = filteredData.filter(user => 
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.id.includes(searchTerm)
        );
      }
      
      if (dateRange?.from) {
        const fromDate = new Date(dateRange.from);
        filteredData = filteredData.filter(user => {
          const userDate = new Date(user.created_at);
          return userDate >= fromDate;
        });
      }
      
      if (dateRange?.to) {
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        filteredData = filteredData.filter(user => {
          const userDate = new Date(user.created_at);
          return userDate <= toDate;
        });
      }
      
      if (role) {
        filteredData = filteredData.filter(user => user.role === role);
      }

      if (country) {
        filteredData = filteredData.filter(user => user.country === country);
      }

      if (category) {
        filteredData = filteredData.filter(user => 
          user.categories_played && 
          Array.isArray(user.categories_played) && 
          user.categories_played.includes(category)
        );
      }
      
      // Sort by role if requested
      if (role || roleSortDirection) {
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
      const profiles = paginatedData.map(user => ({
        id: user.id,
        display_name: user.display_name || 'N/A',
        bio: null,
        avatar_url: null,
        role: (user.role || 'player') as UserRole,
        country: user.country || null,
        categories_played: user.categories_played || [],
        credits: 0,
        achievements: [],
        referral_code: null,
        created_at: user.created_at,
        updated_at: user.created_at,
        email: user.email || null
      } as UserProfile & { email: string | null }));

      return { 
        data: profiles,
        count: totalCount,
        countries: Array.from(uniqueCountries),
        categories: Array.from(uniqueCategories)
      };
      
    } catch (error) {
      console.error('Error in useAdminProfiles:', error);
      throw error;
    }
  };

  const usersQuery = useQuery({
    queryKey: ['all-users', page, pageSize, searchTerm, dateRange, role, roleSortDirection, country, category],
    queryFn: fetchUsers,
    enabled: !!currentUserId && isAdmin,
  });

  const updateUserRole = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: UserRole }) => {
      console.log(`Updating role for user ${userId} to ${newRole}`);
      
      const { data, error } = await supabase
        .from('profiles')
        .upsert({ 
          id: userId, 
          role: newRole 
        })
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
    }
  });

  const bulkUpdateRoles = useMutation({
    mutationFn: async ({ userIds, newRole }: { userIds: string[]; newRole: UserRole }) => {
      console.log(`Bulk updating role to ${newRole} for ${userIds.length} users`);
      
      const { data, error } = await supabase.functions.invoke('admin-update-roles', {
        body: { userIds, newRole }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
    }
  });

  const sendBulkEmail = useMutation({
    mutationFn: async ({ 
      userIds, 
      subject, 
      body 
    }: { 
      userIds: string[]; 
      subject: string; 
      body: string; 
    }) => {
      console.log(`Sending email to ${userIds.length} users`);
      
      const { data, error } = await supabase.functions.invoke('admin-email-users', {
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
