
import { useUserFilters } from './useUserFilters';
import { useUserSelection } from './useUserSelection';
import { useUserExport } from './useUserExport';
import { useAdminProfiles } from '@/hooks/useAdminProfiles';
import { UserRole } from '@/types/userTypes';
import { useState, useEffect } from 'react';
import { UserStats } from '@/types/adminTypes';
import { toast } from '@/components/ui/use-toast';

export function useUserManagement(isAdmin: boolean, currentUserId: string | null) {
  const filters = useUserFilters();
  const selection = useUserSelection();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [lastLoginSortDirection, setLastLoginSortDirection] = useState<'asc' | 'desc'>('desc');
  const [bulkRole, setBulkRole] = useState<UserRole | null>(null);
  const [isBulkRoleChanging, setIsBulkRoleChanging] = useState(false);
  const [hasAttemptedRefetch, setHasAttemptedRefetch] = useState(false);
  
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
    lastLoginSortDirection,
    userType: filters.userType
  });

  useEffect(() => {
    // Log data for debugging
    console.log('useUserManagement - Received data:', {
      hasData: !!allProfilesData,
      userCount: allProfilesData?.data?.length || 0,
      isLoading: isLoadingProfiles,
      error: profileError,
      isAdmin,
      currentUserId,
      hasAttemptedRefetch
    });
    
    // Show toast if there's an error
    if (profileError) {
      toast({
        title: "Error loading users",
        description: profileError.message || "Unknown error occurred",
        variant: "destructive"
      });
    }
  }, [allProfilesData, isLoadingProfiles, profileError, isAdmin, currentUserId, hasAttemptedRefetch]);

  // Trigger a refetch if initial data is empty but credentials seem valid
  useEffect(() => {
    if (isAdmin && currentUserId && !isLoadingProfiles && !hasAttemptedRefetch && 
        (!allProfilesData || !allProfilesData.data || allProfilesData.data.length === 0)) {
      console.log('No users found initially, attempting refetch...');
      // Add a slight delay before refetch
      const timer = setTimeout(() => {
        refetch();
        setHasAttemptedRefetch(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isAdmin, currentUserId, isLoadingProfiles, profileError, allProfilesData, refetch, hasAttemptedRefetch]);

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

  // Calculate user statistics when data changes
  useEffect(() => {
    if (allProfilesData?.data) {
      // Calculate gender breakdown
      const genderBreakdown: { [key: string]: number } = {
        'Male': 0,
        'Female': 0,
        'Other': 0,
        'Unknown': 0
      };
      
      allProfilesData.data.forEach(user => {
        const gender = user.gender || 'Unknown';
        genderBreakdown[gender] = (genderBreakdown[gender] || 0) + 1;
      });

      // Calculate age breakdown if available
      const ageBreakdown: { [key: string]: number } = {};
      
      allProfilesData.data.forEach(user => {
        if (user.age_group) {
          ageBreakdown[user.age_group] = (ageBreakdown[user.age_group] || 0) + 1;
        }
      });

      // Count admins vs regular users
      let adminCount = 0;
      let regularCount = 0;
      
      allProfilesData.data.forEach(user => {
        const role = user.role || 'player';
        if (['admin', 'super_admin', 'category_manager', 'cfo', 'partner_manager'].includes(role)) {
          adminCount++;
        } else {
          regularCount++;
        }
      });

      // Set the complete stats object
      setUserStats({
        total: allProfilesData.count || allProfilesData.data.length,
        genderBreakdown,
        ageBreakdown: Object.keys(ageBreakdown).length > 0 ? ageBreakdown : undefined,
        adminCount,
        regularCount
      });
    } else {
      // Set default stats when no data is available
      setUserStats({
        total: 0,
        genderBreakdown: { 'Unknown': 0 },
        adminCount: 0,
        regularCount: 0
      });
    }
  }, [allProfilesData]);

  const { handleExportUsers } = useUserExport();
  
  // Manual refresh function with feedback
  const handleRefresh = () => {
    toast({
      title: "Refreshing user data",
      description: "Fetching the latest user information..."
    });
    refetch();
  };

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
    isBulkRoleChanging,
    // Refetch function
    refetch: handleRefresh
  };
}
