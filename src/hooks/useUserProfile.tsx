
import { useAuthState } from './auth/useAuthState';
import { useProfileData } from './profile/useProfileData';
import { useAdminStatus } from './profile/useAdminStatus';
import { useProfileMutation } from './profile/useProfileMutation';
import { useRoleManagement } from './profile/useRoleManagement';
import { useAdminProfiles } from './profile/useAdminProfiles';
import { useState, useEffect } from 'react';

export function useUserProfile(userId?: string) {
  const { currentUserId } = useAuthState();
  const profileId = userId || currentUserId;
  
  const { data: profile, isLoading, error, refetch } = useProfileData(profileId);
  const { isAdmin } = useAdminStatus(profile);
  const { updateProfile } = useProfileMutation(profileId);
  const { updateUserRole } = useRoleManagement();
  const { data: allProfiles, isLoading: isLoadingProfiles } = useAdminProfiles(isAdmin, currentUserId);

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
    updateProfile,
    updateUserRole,
    currentUserId,
    refetch
  };
}
