
import { useUserFilters } from './useUserFilters';
import { useUserEmails } from './useUserEmails';
import { useUserRoles } from './useUserRoles';
import { useUserSelection } from './useUserSelection';
import { useUserExport } from './useUserExport';
import { useAdminProfiles } from '@/hooks/useAdminProfiles';

export function useUserManagement(isAdmin: boolean, currentUserId: string | null) {
  const filters = useUserFilters();
  const selection = useUserSelection();
  
  const { 
    data: allProfilesData, 
    isLoading: isLoadingProfiles, 
    error: profileError,
    updateUserRole,
    bulkUpdateRoles,
    sendBulkEmail,
    refetch 
  } = useAdminProfiles(isAdmin, currentUserId, filters.filterOptions);

  const emails = useUserEmails({ 
    sendBulkEmail, 
    selectedUsers: selection.selectedUsers 
  });

  const roles = useUserRoles({ 
    updateUserRole, 
    bulkUpdateRoles, 
    refetch,
    selectedUsers: selection.selectedUsers 
  });

  const { handleExportUsers } = useUserExport();

  return {
    // Spread all the props from individual hooks
    ...filters,
    ...selection,
    ...emails,
    ...roles,
    allProfilesData,
    isLoadingProfiles,
    profileError,
    handleExportUsers: () => handleExportUsers(allProfilesData?.data),
    totalPages: Math.ceil((allProfilesData?.count || 0) / filters.pageSize)
  };
}
