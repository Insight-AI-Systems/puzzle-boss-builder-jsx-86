
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile, UserRole } from '@/types/userTypes';

interface UserProfileReturn {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  currentUserId: string | null;
  allProfiles: { data: UserProfile[] | null };
  isLoadingProfiles: boolean;
  updateUserRole: {
    mutate: (params: { targetUserId: string; newRole: UserRole }) => void;
    mutateAsync: (params: { targetUserId: string; newRole: UserRole }) => Promise<any>;
  };
  refetch: () => void;
}

export function useUserProfile(): UserProfileReturn {
  const { user, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      try {
        console.log('Profile data request for ID:', user.id);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          throw new Error(`Failed to fetch profile: ${error.message}`);
        }

        console.log('Profile data retrieved:', data);
        
        const userProfile: UserProfile = {
          id: data.id,
          email: user.email || null,
          display_name: data.username || data.full_name || null,
          bio: data.bio || null,
          avatar_url: data.avatar_url,
          role: (data.role || 'player') as UserRole,
          country: data.country || null,
          categories_played: data.categories_played || [],
          credits: data.credits || 0,
          achievements: [],
          referral_code: null,
          created_at: data.created_at,
          updated_at: data.updated_at || data.created_at
        };

        return userProfile;
      } catch (err) {
        console.error('Error in useUserProfile:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        return null;
      }
    },
    enabled: !!user && isAuthenticated,
  });

  // Mock implementation for allProfiles to satisfy interface
  const allProfiles = { data: null };
  const isLoadingProfiles = false;

  const updateUserRole = useMutation({
    mutationFn: async ({ targetUserId, newRole }: { targetUserId: string; newRole: UserRole }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', targetUserId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['all-users'] });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'Failed to update user role');
    },
  });

  const isAdmin = profileQuery.data?.role === 'admin' || profileQuery.data?.role === 'super_admin';

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: error || (profileQuery.error instanceof Error ? profileQuery.error.message : null),
    isAdmin,
    currentUserId: user?.id || null,
    allProfiles,
    isLoadingProfiles,
    updateUserRole,
    refetch: profileQuery.refetch
  };
}
