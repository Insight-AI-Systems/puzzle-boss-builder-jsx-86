
import { useAuthState } from './auth/useAuthState';
import { useProfileData } from './profile/useProfileData';
import { useAdminStatus } from './profile/useAdminStatus';
import { useProfileMutation } from './profile/useProfileMutation';
import { useRoleManagement } from './profile/useRoleManagement';
import { useAdminProfiles, AdminProfilesOptions } from './useAdminProfiles';
import { useState, useEffect } from 'react';

export function useUserProfile(options?: AdminProfilesOptions | string) {
  const { currentUserId } = useAuthState();
  
  // Handle both string (userId) and options object
  const targetUserId = typeof options === 'string' ? options : undefined;
  const profileId = targetUserId || currentUserId;
  
  const { data: profile, isLoading, error, refetch } = useProfileData(profileId);
  const { isAdmin } = useAdminStatus(profile);
  const { updateProfile } = useProfileMutation(profileId);
  const { updateUserRole } = useRoleManagement();
  
  // Convert string userId to AdminProfilesOptions if needed
  const adminProfilesOptions: AdminProfilesOptions = 
    typeof options === 'string' ? {} : options || {};
  
  const { 
    data: allProfiles, 
    isLoading: isLoadingProfiles,
    error: profilesError,
    refetch: refetchProfiles 
  } = useAdminProfiles(isAdmin, currentUserId, adminProfilesOptions);

  // Additional debugging
  useEffect(() => {
    console.log('useUserProfile - Current User ID:', currentUserId);
    console.log('useUserProfile - Profile ID being used:', profileId);
  }, [currentUserId, profileId]);
  
  // Monitor for profile updates
  useEffect(() => {
    if (profile) {
      console.log('useUserProfile hook - Profile loaded:', profile);
      console.log('useUserProfile hook - Is Admin:', isAdmin);
    }
  }, [profile, isAdmin]);
  
  // Monitor for mutation state
  useEffect(() => {
    console.log('useUserProfile hook - Update Profile Mutation State:', 
      updateProfile.isPending ? 'Pending' : 
      updateProfile.isError ? 'Error' : 
      updateProfile.isSuccess ? 'Success' : 'Idle');
    
    if (updateProfile.isSuccess) {
      console.log('Profile update was successful - refetching data');
      refetch();
    }
    
    if (updateProfile.isError) {
      console.error('Profile update error:', updateProfile.error);
    }
  }, [updateProfile.isPending, updateProfile.isError, updateProfile.isSuccess, refetch]);

  return {
    profile,
    isLoading,
    error,
    isAdmin,
    allProfiles,
    isLoadingProfiles,
    error: error || profilesError, // Expose combined error
    updateProfile,
    updateUserRole,
    currentUserId,
    refetch: () => {
      refetch();
      refetchProfiles();
    }
  };
}
