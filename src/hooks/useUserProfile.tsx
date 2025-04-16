
import { useAuthState } from './auth/useAuthState';
import { useProfileData } from './profile/useProfileData';
import { useAdminStatus } from './profile/useAdminStatus';
import { useProfileMutation } from './profile/useProfileMutation';
import { useRoleManagement } from './profile/useRoleManagement';
import { useAdminProfiles } from './profile/useAdminProfiles';

export function useUserProfile(userId?: string) {
  const { currentUserId } = useAuthState();
  const profileId = userId || currentUserId;
  
  const { data: profile, isLoading, error } = useProfileData(profileId);
  const { isAdmin } = useAdminStatus(profile);
  const { updateProfile } = useProfileMutation(profileId);
  const { updateUserRole } = useRoleManagement();
  const { data: allProfiles, isLoading: isLoadingProfiles } = useAdminProfiles(isAdmin, currentUserId);

  return {
    profile,
    isLoading,
    error,
    isAdmin,
    allProfiles,
    isLoadingProfiles,
    updateProfile,
    updateUserRole,
    currentUserId
  };
}

