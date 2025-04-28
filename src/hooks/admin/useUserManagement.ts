
import { useUserFilters } from './useUserFilters';
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
  const [bulkRole, setBulkRole] = useState<UserRole | null>(null);
  const [isBulkRoleChanging, setIsBulkRoleChanging] = useState(false);
  
  const { 
    data: allProfilesData, 
    isLoading: isLoadingProfiles, 
    error: profileError,
    updateUserRole,
    bulkUpdateRoles: updateRoles,
    sendBulkEmail: sendEmail,
    refetch 
  } = useAdminProfiles(isAdmin, currentUserId, {
    ...filters.filterOptions,
    lastLoginSortDirection
  });

  // Handle role change for a single user
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (updateUserRole) {
      updateUserRole.mutate({ userId, newRole });
    }
  };

  // Handle bulk role updates
  const bulkUpdateRoles = async (userIds: string[], newRole: UserRole) => {
    if (updateRoles) {
      setIsBulkRoleChanging(true);
      try {
        await updateRoles.mutateAsync({ userIds, newRole });
        selection.setSelectedUsers(new Set());
      } finally {
        setIsBulkRoleChanging(false);
      }
    }
  };

  // Handle sending bulk emails
  const sendBulkEmail = async (subject: string, message: string) => {
    if (sendEmail && selection.selectedUsers.size > 0) {
      const userIds = Array.from(selection.selectedUsers);
      await sendEmail.mutateAsync({ userIds, subject, message });
    }
  };

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

  const { handleExportUsers } = useUserExport();

  return {
    // Filter props from useUserFilters
    ...filters,
    // Selection props 
    selectedUsers: selection.selectedUsers,
    setSelectedUsers: selection.setSelectedUsers,
    handleUserSelection: selection.handleUserSelection,
    handleSelectAllUsers: selection.handleSelectAllUsers,
    // Email and role management
    sendBulkEmail,
    bulkUpdateRoles,
    handleRoleChange,
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
    setLastLoginSortDirection,
    // Bulk role props
    bulkRole,
    setBulkRole,
    isBulkRoleChanging
  };
}
