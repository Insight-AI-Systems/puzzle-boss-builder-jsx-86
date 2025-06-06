
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserRole } from '@/types/userTypes';
import { useToast } from '@/hooks/use-toast';

// Define the return type for the hook
interface AdminProfilesData {
  data: UserProfile[];
  count: number;
  countries: string[];
  categories: string[];
  signup_stats: Array<{month: string; count: number}>;
}

export function useAdminProfiles(isAdmin: boolean, currentUserId: string | null) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['admin-all-users'],
    queryFn: async (): Promise<AdminProfilesData> => {
      if (!isAdmin || !currentUserId) {
        console.log('Not authorized to fetch profiles or no user ID');
        return {
          data: [],
          count: 0,
          countries: [],
          categories: [],
          signup_stats: []
        };
      }
      
      console.log('Fetching all users from edge function');
      
      try {
        const { data, error } = await supabase.functions.invoke('get-all-users', {
          headers: {
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
        });
        
        if (error) {
          console.error('Edge function error:', error);
          throw new Error(`Failed to fetch users: ${error.message}`);
        }
        
        if (!data) {
          console.log('No data returned from edge function');
          return {
            data: [],
            count: 0,
            countries: [],
            categories: [],
            signup_stats: []
          };
        }
        
        console.log('Users fetched successfully:', data.length || 0);
        
        // Transform the data to match UserProfile interface
        const userProfiles = (data as any[]).map(user => ({
          id: user.id,
          email: user.email,
          display_name: user.display_name || null,
          bio: null,
          avatar_url: null,
          role: (user.role || 'player') as UserRole,
          country: user.country || null,
          categories_played: user.categories_played || [],
          credits: 0,
          achievements: [],
          referral_code: null,
          created_at: user.created_at || new Date().toISOString(),
          updated_at: user.updated_at || new Date().toISOString(),
          last_sign_in: user.last_sign_in || null,
          gender: user.gender || null,
          custom_gender: user.custom_gender || null,
          age_group: user.age_group || null,
        } as UserProfile));

        // Extract unique countries and categories
        const countries = [...new Set(userProfiles.map(user => user.country).filter(Boolean))] as string[];
        const categoriesSet = new Set<string>();
        userProfiles.forEach(user => {
          if (user.categories_played && Array.isArray(user.categories_played)) {
            user.categories_played.forEach(category => {
              if (category) categoriesSet.add(category);
            });
          }
        });
        const categories = Array.from(categoriesSet);

        // Generate mock signup stats (replace with real data when available)
        const signup_stats = Array.from({length: 6}, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          return {
            month: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
            count: Math.floor(Math.random() * 10) + 1
          };
        }).reverse();

        return {
          data: userProfiles,
          count: userProfiles.length,
          countries,
          categories,
          signup_stats
        };
        
      } catch (error: any) {
        console.error('Error in useAdminProfiles:', error);
        toast({
          title: "Error loading users",
          description: error.message || "Failed to load user data",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!currentUserId && isAdmin,
    retry: 2,
    retryDelay: 1000,
  });

  // Mutation for updating user roles
  const updateUserRole = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: UserRole }) => {
      const { data, error } = await supabase.functions.invoke('admin-update-roles', {
        body: { userIds: [userId], newRole },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-all-users'] });
      toast({
        title: "Role updated",
        description: "User role has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating role",
        description: error.message || "Failed to update user role",
        variant: "destructive",
      });
    },
  });

  // Mutation for bulk role updates
  const bulkUpdateRoles = useMutation({
    mutationFn: async ({ userIds, newRole }: { userIds: string[]; newRole: UserRole }) => {
      const { data, error } = await supabase.functions.invoke('admin-update-roles', {
        body: { userIds, newRole },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-all-users'] });
      toast({
        title: "Roles updated",
        description: "User roles have been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating roles",
        description: error.message || "Failed to update user roles",
        variant: "destructive",
      });
    },
  });

  // Mutation for sending bulk emails
  const sendBulkEmail = useMutation({
    mutationFn: async ({ userIds, subject, body }: { userIds: string[]; subject: string; body: string }) => {
      const { data, error } = await supabase.functions.invoke('admin-email-users', {
        body: { userIds, subject, body },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Emails sent",
        description: "Bulk email has been sent successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error sending emails",
        description: error.message || "Failed to send bulk email",
        variant: "destructive",
      });
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    updateUserRole,
    bulkUpdateRoles,
    sendBulkEmail,
  };
}
