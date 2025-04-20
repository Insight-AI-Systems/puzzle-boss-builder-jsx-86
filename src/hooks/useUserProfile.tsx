
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile, UserRole } from '@/types/userTypes';
import { useAdminProfiles, AdminProfilesOptions } from './useAdminProfiles';

export interface ProfileUpdateData {
  username?: string;
  bio?: string;
  avatar_url?: string | null;
}

interface RoleUpdateParams {
  targetUserId: string;
  newRole: UserRole;
}

export function useUserProfile(adminOptions?: AdminProfilesOptions) {
  const { user } = useAuth();
  const [error, setError] = useState<Error | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Fetch basic profile
  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      try {
        console.log('Profile data request for ID:', user.id);
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, bio, avatar_url, role, country, categories_played, credits, created_at, updated_at')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          throw new Error(`Failed to fetch profile: ${error.message}`);
        }

        console.log('Profile data retrieved:', data);
        
        const userProfile: UserProfile = {
          id: data.id,
          display_name: data.username || null,
          bio: data.bio || null,
          avatar_url: data.avatar_url,
          role: (data.role || 'player') as UserRole,
          country: data.country || null,
          categories_played: Array.isArray(data.categories_played) ? data.categories_played : [],
          credits: data.credits || 0,
          achievements: [],
          referral_code: null,
          created_at: data.created_at,
          updated_at: data.updated_at || data.created_at
        };

        setIsAdmin(['admin', 'super_admin'].includes(userProfile.role));
        
        return userProfile;
      } catch (err) {
        console.error('Error in useUserProfile:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        return null;
      }
    },
    enabled: !!user,
  });

  // Use the useAdminProfiles hook to fetch all profiles if the user is an admin
  const {
    data: allProfiles,
    isLoading: isLoadingProfiles,
    refetch: refetchProfiles
  } = useAdminProfiles(isAdmin, user?.id || null, adminOptions);

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (profileData: ProfileUpdateData) => {
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id)
        .select('id, username, bio, avatar_url, role, country, categories_played, credits, created_at, updated_at')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      refetch();
    },
    onError: (err) => {
      setError(err instanceof Error ? err : new Error('Failed to update profile'));
    },
  });

  // Update user role mutation for admins
  const updateUserRole = useMutation({
    mutationFn: async ({ targetUserId, newRole }: RoleUpdateParams) => {
      if (!isAdmin && profile?.role !== 'super_admin') {
        throw new Error('Only admins can update user roles');
      }

      // Check if user is trying to change own role
      if (targetUserId === user?.id && profile?.role !== 'super_admin') {
        throw new Error('You cannot change your own role');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', targetUserId)
        .select('id, username, bio, avatar_url, role, country, categories_played, credits, created_at, updated_at')
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Refetch all profiles to update the UI
      refetchProfiles();
    },
    onError: (err) => {
      setError(err instanceof Error ? err : new Error('Failed to update user role'));
    },
  });

  return {
    profile,
    isLoading,
    isAdmin,
    currentUserId: user?.id || null,
    updateProfile,
    updateUserRole,
    allProfiles,
    isLoadingProfiles,
    error,
    refetch: () => {
      refetch();
      refetchProfiles();
    }
  };
}
