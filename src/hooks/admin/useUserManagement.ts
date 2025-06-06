
import { useUserFilters } from './useUserFilters';
import { useUserSelection } from './useUserSelection';
import { useUserExport } from './useUserExport';
import { useAdminProfiles } from '@/hooks/useAdminProfiles';
import { UserRole } from '@/types/userTypes';
import { useState, useEffect, useMemo } from 'react';
import { UserStats } from '@/types/adminTypes';

// Helper function to categorize user roles
const isAdminRole = (role: UserRole): boolean => {
  const adminRoles: UserRole[] = ['super_admin', 'admin', 'category_manager', 'social_media_manager', 'partner_manager', 'cfo'];
  return adminRoles.includes(role);
};

export function useUserManagement(isAdmin: boolean, currentUserId: string | null) {
  const filters = useUserFilters();
  const selection = useUserSelection();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [lastLoginSortDirection, setLastLoginSortDirection] = useState<'asc' | 'desc'>('desc');
  const [bulkRole, setBulkRoleState] = useState<UserRole | null>(null);
  const [isBulkRoleChanging, setIsBulkRoleChanging] = useState(false);
  
  const { 
    data: allProfilesData, 
    isLoading: isLoadingProfiles, 
    error: profileError,
    updateUserRole,
    bulkUpdateRoles: updateRoles,
    sendBulkEmail: sendEmail,
    refetch 
  } = useAdminProfiles(isAdmin, currentUserId);

  // Filter users based on the selected user type (regular/admin)
  const filteredData = useMemo(() => {
    if (!allProfilesData?.data) return null;

    const filteredUsers = allProfilesData.data.filter(user => {
      if (filters.userType === 'regular') {
        return user.role === 'player';
      } else {
        return isAdminRole(user.role);
      }
    });

    return {
      ...allProfilesData,
      data: filteredUsers,
      count: filteredUsers.length
    };
  }, [allProfilesData, filters.userType]);

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
      await sendEmail.mutateAsync({ userIds, subject, body: message });
    }
  };

  // Properly typed setBulkRole function that accepts UserRole or null
  const setBulkRole = (role: UserRole | null) => {
    setBulkRoleState(role);
  };

  // Calculate user statistics when data changes - use filtered data
  useEffect(() => {
    if (filteredData?.data) {
      // Calculate gender breakdown
      const genderBreakdown: { [key: string]: number } = {};
      
      filteredData.data.forEach(user => {
        const gender = user.gender || 'null';
        genderBreakdown[gender] = (genderBreakdown[gender] || 0) + 1;
      });

      // Calculate age breakdown if available
      const ageBreakdown: { [key: string]: number } = {};
      
      filteredData.data.forEach(user => {
        if (user.age_group) {
          ageBreakdown[user.age_group] = (ageBreakdown[user.age_group] || 0) + 1;
        }
      });

      // Set the complete stats object using filtered data
      setUserStats({
        total: filteredData.count,
        genderBreakdown,
        ageBreakdown: Object.keys(ageBreakdown).length > 0 ? ageBreakdown : undefined
      });
    }
  }, [filteredData]);

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
    // Data props - use filtered data instead of raw data
    allProfilesData: filteredData,
    isLoadingProfiles,
    profileError,
    // Export functionality - use filtered data
    handleExportUsers: () => handleExportUsers(filteredData?.data),
    // Stats and calculated values - use filtered data count
    totalPages: Math.ceil((filteredData?.count || 0) / filters.pageSize),
    userStats,
    // Sorting props
    lastLoginSortDirection,
    setLastLoginSortDirection,
    // Bulk role props with proper typing
    bulkRole,
    setBulkRole,
    isBulkRoleChanging
  };
}
