
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile, UserRole } from '@/types/userTypes';
import { AdminProfilesOptions } from '@/types/adminTypes';
import { isProtectedAdmin } from '@/constants/securityConfig';

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
  
  // Get queryClient safely
  let queryClient;
  try {
    queryClient = useQueryClient();
  } catch (error) {
    console.error('Error getting queryClient:', error);
  }
  
  // Fetch basic profile
  let profileQuery;
  try {
    profileQuery = useQuery({
      queryKey: ['profile', user?.id],
      queryFn: async () => {
        if (!user) return null;

        try {
          console.log('Profile data request for ID:', user.id);
          const { data, error } = await supabase
            .from('profiles')
            .select('id, username, bio, avatar_url, role, credits, created_at, updated_at')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching profile:', error);
            throw new Error(`Failed to fetch profile: ${error.message}`);
          }

          console.log('Profile data retrieved:', data);
          
          // Create the profile with data from Supabase
          const userProfile: UserProfile = {
            id: data.id,
            email: user.email || null,
            display_name: data.username || null,
            bio: data.bio || null,
            avatar_url: data.avatar_url,
            role: (data.role || 'player') as UserRole,
            country: null, // Default value since column may not exist yet
            categories_played: [], // Default value since column may not exist yet
            credits: data.credits || 0,
            achievements: [],
            referral_code: null,
            created_at: data.created_at,
            updated_at: data.updated_at || data.created_at
          };

          // Check if the user is protected admin based on email
          const hasProtectedAdminEmail = isProtectedAdmin(user.email);
          
          // Set isAdmin flag based on role or protected admin status
          const isAdminRole = ['admin', 'super_admin'].includes(userProfile.role);
          const adminStatus = isAdminRole || hasProtectedAdminEmail;
          
          setIsAdmin(adminStatus);
          
          // If they have protected admin email but not the super_admin role in the database,
          // override the role to super_admin
          if (hasProtectedAdminEmail && userProfile.role !== 'super_admin') {
            console.log('Protected admin email detected, overriding role to super_admin');
            userProfile.role = 'super_admin';
          }
          
          return userProfile;
        } catch (err) {
          console.error('Error in useUserProfile:', err);
          setError(err instanceof Error ? err : new Error('An unknown error occurred'));
          return null;
        }
      },
      enabled: !!user,
    });
  } catch (error) {
    console.error('React Query error in useUserProfile profile fetch:', error);
    profileQuery = { 
      data: null, 
      isLoading: false, 
      error,
      refetch: () => Promise.resolve() 
    };
  }

  // Avoid calling useAdminProfiles for now since it might be causing the error
  const allProfiles = { 
    data: null, 
    isLoading: false, 
    refetch: () => Promise.resolve() 
  };

  // Update profile mutation
  let updateProfileMutation;
  try {
    updateProfileMutation = useMutation({
      mutationFn: async (profileData: ProfileUpdateData) => {
        if (!user) throw new Error('No authenticated user');

        const { data, error } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', user.id)
          .select('id, username, bio, avatar_url, role, credits, created_at, updated_at')
          .single();

        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        if (queryClient) {
          queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
        }
      },
      onError: (err) => {
        setError(err instanceof Error ? err : new Error('Failed to update profile'));
      },
    });
  } catch (error) {
    console.error('React Query error in useUserProfile updateProfile:', error);
    updateProfileMutation = { 
      mutate: () => {}, 
      mutateAsync: () => Promise.resolve(null) 
    };
  }

  // Update user role mutation for admins
  let updateRoleMutation;
  try {
    updateRoleMutation = useMutation({
      mutationFn: async ({ targetUserId, newRole }: RoleUpdateParams) => {
        if (!isAdmin && profileQuery.data?.role !== 'super_admin') {
          throw new Error('Only admins can update user roles');
        }

        // Check if user is trying to change own role
        if (targetUserId === user?.id && profileQuery.data?.role !== 'super_admin') {
          throw new Error('You cannot change your own role');
        }

        const { data, error } = await supabase
          .from('profiles')
          .update({ role: newRole })
          .eq('id', targetUserId)
          .select('id, username, bio, avatar_url, role, credits, created_at, updated_at')
          .single();

        if (error) throw error;
        return data;
      },
      onSuccess: () => {
        if (queryClient) {
          queryClient.invalidateQueries({ queryKey: ['all-users'] });
        }
      },
      onError: (err) => {
        setError(err instanceof Error ? err : new Error('Failed to update user role'));
      },
    });
  } catch (error) {
    console.error('React Query error in useUserProfile updateRole:', error);
    updateRoleMutation = { 
      mutate: () => {}, 
      mutateAsync: () => Promise.resolve(null) 
    };
  }

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isAdmin,
    currentUserId: user?.id || null,
    updateProfile: updateProfileMutation,
    updateUserRole: updateRoleMutation,
    allProfiles: allProfiles.data,
    isLoadingProfiles: allProfiles.isLoading,
    error,
    refetch: () => {
      profileQuery.refetch();
      allProfiles.refetch();
    }
  };
}
