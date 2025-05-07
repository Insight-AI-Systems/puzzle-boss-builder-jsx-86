
import { useUserFilters } from './useUserFilters';
import { useUserSelection } from './useUserSelection';
import { useUserExport } from './useUserExport';
import { UserRole } from '@/types/userTypes';
import { useState, useEffect } from 'react';
import { UserStats } from '@/types/adminTypes';
import { toast } from '@/components/ui/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { roleService } from '@/services/roleService';

export function useUserManagement(isAdmin: boolean, currentUserId: string | null) {
  const filters = useUserFilters();
  const selection = useUserSelection();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [lastLoginSortDirection, setLastLoginSortDirection] = useState<'asc' | 'desc'>('desc');
  const [bulkRole, setBulkRole] = useState<UserRole | null>(null);
  const [isBulkRoleChanging, setIsBulkRoleChanging] = useState(false);
  const [hasAttemptedRefetch, setHasAttemptedRefetch] = useState(false);
  const queryClient = useQueryClient();
  
  // Set queryClient in services
  userService.setQueryClient(queryClient);
  roleService.setQueryClient(queryClient);

  // Define admin roles array for filtering
  const ADMIN_ROLES = ['super_admin', 'admin', 'category_manager', 'social_media_manager', 'partner_manager', 'cfo'];
  
  // Fetch users using the new userService
  const {
    data: allUsers,
    isLoading: isLoadingProfiles,
    error: profileError,
    refetch
  } = useQuery({
    queryKey: ['all-users', filters.userType],
    queryFn: async () => {
      try {
        const users = await userService.getAllUsers();
        return users;
      } catch (error) {
        toast({
          title: "Error loading users",
          description: error instanceof Error ? error.message : "Failed to load users",
          variant: "destructive"
        });
        throw error;
      }
    },
    enabled: isAdmin && !!currentUserId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter users based on filters and user type
  const filteredUsers = allUsers ? userService.filterUsers(allUsers, {
    ...filters.filterOptions,
    userType: filters.userType
  }) : [];

  // Handle role change for a single user
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await roleService.updateUserRole(userId, newRole, () => {
        refetch();
      });
    } catch (error) {
      // Error handling is done inside roleService
      console.error("Role change failed:", error);
    }
  };

  // Handle bulk role updates
  const bulkUpdateRoles = async (userIds: string[], newRole: UserRole) => {
    if (userIds.length === 0 || !newRole) return;
    
    setIsBulkRoleChanging(true);
    try {
      await roleService.bulkUpdateRoles(userIds, newRole, () => {
        selection.setSelectedUsers(new Set());
        refetch();
      });
    } catch (error) {
      // Error handling is done inside roleService
      console.error("Bulk role update failed:", error);
    } finally {
      setIsBulkRoleChanging(false);
    }
  };

  // Calculate user statistics when data changes
  useEffect(() => {
    if (!allUsers) return;
    
    // Count admins vs regular users
    let adminCount = 0;
    let regularCount = 0;
    
    allUsers.forEach(user => {
      const role = user.role || 'player';
      if (ADMIN_ROLES.includes(role)) {
        adminCount++;
      } else {
        regularCount++;
      }
    });

    // Calculate gender breakdown
    const genderBreakdown: { [key: string]: number } = {
      'Male': 0,
      'Female': 0,
      'Other': 0,
      'Unknown': 0
    };
    
    allUsers.forEach(user => {
      const gender = user.gender || 'Unknown';
      genderBreakdown[gender] = (genderBreakdown[gender] || 0) + 1;
    });

    // Calculate age breakdown if available
    const ageBreakdown: { [key: string]: number } = {};
    
    allUsers.forEach(user => {
      if (user.age_group) {
        ageBreakdown[user.age_group] = (ageBreakdown[user.age_group] || 0) + 1;
      }
    });

    // Set the complete stats object
    setUserStats({
      total: allUsers.length,
      genderBreakdown,
      ageBreakdown: Object.keys(ageBreakdown).length > 0 ? ageBreakdown : undefined,
      adminCount,
      regularCount
    });
  }, [allUsers]);

  // Handle sending bulk emails through edge function
  const sendBulkEmail = async (subject: string, message: string) => {
    if (selection.selectedUsers.size === 0) return;
    
    try {
      const userIds = Array.from(selection.selectedUsers);
      toast({
        title: "Sending emails...",
        description: `Sending email to ${userIds.length} users`
      });
      
      const { data, error } = await fetch('/api/send-bulk-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds, subject, body: message })
      }).then(res => res.json());
      
      if (error) throw error;
      
      toast({
        title: "Emails sent successfully",
        description: `${userIds.length} emails have been scheduled for delivery`
      });
      
      return data;
    } catch (error) {
      toast({
        title: "Failed to send emails",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  };

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
    allProfilesData: { data: allUsers },
    filteredUsers, // Return filtered users
    isLoadingProfiles,
    profileError,
    // Export functionality
    handleExportUsers: () => handleExportUsers(filteredUsers),
    // Stats and calculated values
    totalPages: Math.ceil((filteredUsers.length || 0) / filters.pageSize),
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
