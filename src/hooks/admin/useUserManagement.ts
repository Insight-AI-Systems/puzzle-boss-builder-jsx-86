
import { useUserFilters } from './useUserFilters';
import { useUserEmails } from './useUserEmails';
import { useUserRoles } from './useUserRoles';
import { useUserSelection } from './useUserSelection';
import { useUserExport } from './useUserExport';
import { useAdminProfiles } from '@/hooks/useAdminProfiles';
import { UserRole } from '@/types/userTypes';
import { useState, useEffect } from 'react';
import { UserStats } from '@/types/adminTypes';

export function useUserManagement(isAdmin: boolean, currentUserId: string | null) {
  const filters = useUserFilters();
  const selection = useUserSelection();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [lastLoginSortDirection, setLastLoginSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const { 
    data: allProfilesData, 
    isLoading: isLoadingProfiles, 
    error: profileError,
    updateUserRole,
    bulkUpdateRoles,
    sendBulkEmail,
    refetch 
  } = useAdminProfiles(isAdmin, currentUserId, {
    ...filters.filterOptions,
    lastLoginSortDirection
  });

  const emails = useUserEmails({ 
    sendBulkEmail, 
    selectedUsers: selection.selectedUsers 
  });

  const roles = useUserRoles({ 
    updateUserRole: async (userId: string, newRole: UserRole) => {
      updateUserRole.mutate({ userId, newRole });
    }, 
    bulkUpdateRoles: async (userIds: string[], newRole: UserRole) => {
      bulkUpdateRoles.mutate({ userIds, newRole });
    }, 
    refetch,
    selectedUsers: selection.selectedUsers 
  });

  const { handleExportUsers } = useUserExport();

  // Calculate user statistics when data changes
  useEffect(() => {
    if (allProfilesData?.data) {
      // Calculate gender breakdown
      const genderBreakdown: { [key: string]: number } = {};
      
      allProfilesData.data.forEach(user => {
        const gender = user.gender || 'null';
        genderBreakdown[gender] = (genderBreakdown[gender] || 0) + 1;
      });

      // Calculate age breakdown if available
      const ageBreakdown: { [key: string]: number } = {};
      
      allProfilesData.data.forEach(user => {
        if (user.age_group) {
          ageBreakdown[user.age_group] = (ageBreakdown[user.age_group] || 0) + 1;
        }
      });

      // Set the complete stats object
      setUserStats({
        total: allProfilesData.count,
        genderBreakdown,
        ageBreakdown: Object.keys(ageBreakdown).length > 0 ? ageBreakdown : undefined
      });
    }
  }, [allProfilesData]);

  return {
    // Filter props from useUserFilters
    ...filters,
    // Selection props 
    selectedUsers: selection.selectedUsers,
    setSelectedUsers: selection.setSelectedUsers,
    handleUserSelection: selection.handleUserSelection,
    handleSelectAllUsers: selection.handleSelectAllUsers,
    // Email props
    ...emails,
    // Roles props
    ...roles,
    // Data props
    allProfilesData,
    isLoadingProfiles,
    profileError,
    // Export functionality
    handleExportUsers: () => handleExportUsers(allProfilesData?.data),
    // Stats and calculated values
    totalPages: Math.ceil((allProfilesData?.count || 0) / filters.pageSize),
    userStats,
    // Sorting props
    lastLoginSortDirection,
    setLastLoginSortDirection
  };
}
