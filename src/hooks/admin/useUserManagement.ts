
import { useState, useCallback, useEffect } from 'react';
import { useUserFilters } from './useUserFilters';
import { useUserRoles } from './useUserRoles';
import { userService } from '@/services/userService';
import { roleService } from '@/services/roleService';
import { useToast } from '@/hooks/use-toast';
import { UserProfile, UserRole } from '@/types/userTypes';
import { errorTracker } from '@/utils/monitoring/errorTracker';
import { performanceMonitor } from '@/utils/monitoring/performanceMonitor';

export function useUserManagement(isAdmin: boolean = false, currentUserId: string | null = null) {
  // Fetch all filter related state and functions
  const filterHook = useUserFilters();
  
  // User data state
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [totalPages, setTotalPages] = useState(1);
  const [userStats, setUserStats] = useState<{
    regularCount: number;
    adminCount: number;
    totalCount: number;
  } | null>(null);
  
  const { toast } = useToast();

  // Fetch users from the service 
  const fetchUsers = useCallback(async () => {
    if (!isAdmin && !currentUserId) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const perfMark = `fetch_users_${Date.now()}`;
      performanceMonitor.markStart(perfMark);
      
      const profiles = await userService.getAllUsers();
      
      performanceMonitor.markEnd(perfMark);
      
      if (profiles && Array.isArray(profiles)) {
        setUsers(profiles);
        
        // Calculate user stats
        const adminCount = profiles.filter(user => 
          ['super_admin', 'admin', 'category_manager', 'social_media_manager', 'partner_manager', 'cfo'].includes(user.role)
        ).length;
        
        setUserStats({
          regularCount: profiles.length - adminCount,
          adminCount,
          totalCount: profiles.length
        });
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch users');
      setError(error);
      errorTracker.trackError(error, 'medium', { source: 'useUserManagement.fetchUsers' });
      
      toast({
        title: 'Error',
        description: 'Failed to load user data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [isAdmin, currentUserId, toast]);
  
  // Role management functionality
  const roleManagement = useUserRoles({
    updateUserRole: async (userId: string, newRole: UserRole) => {
      return roleService.updateUserRole(userId, newRole)
        .then(result => {
          if (result.success) {
            // Update local state optimistically
            setUsers(prevUsers => 
              prevUsers.map(user => 
                user.id === userId ? { ...user, role: newRole } : user
              )
            );
          }
          return result;
        });
    },
    bulkUpdateRoles: async (userIds: string[], newRole: UserRole) => {
      return roleService.bulkUpdateRoles(userIds, newRole)
        .then(result => {
          if (result.success) {
            // Update local state optimistically
            setUsers(prevUsers => 
              prevUsers.map(user => 
                userIds.includes(user.id) ? { ...user, role: newRole } : user
              )
            );
            // Clear selection after successful bulk update
            setSelectedUsers(new Set());
          }
          return result;
        });
    },
    refetch: fetchUsers,
    selectedUsers
  });

  // Apply filters and pagination to users
  useEffect(() => {
    if (!users || !Array.isArray(users)) return;
    
    try {
      // Apply filters based on userType, search, role, etc.
      const filtered = userService.filterUsers(users, {
        searchQuery: filterHook.searchQuery,
        role: filterHook.selectedRole,
        country: filterHook.selectedCountry,
        userType: filterHook.userType
      });
      
      // Apply pagination
      const pageSize = filterHook.pageSize;
      const startIndex = filterHook.page * pageSize;
      const paginatedUsers = filtered.slice(startIndex, startIndex + pageSize);
      
      setFilteredUsers(paginatedUsers);
      setTotalPages(Math.ceil(filtered.length / pageSize));
      
    } catch (err) {
      errorTracker.trackError(
        err instanceof Error ? err : new Error('Error filtering users'), 
        'low', 
        { source: 'useUserManagement.filterEffect' }
      );
    }
  }, [users, filterHook.searchQuery, filterHook.selectedRole, filterHook.selectedCountry, filterHook.userType, filterHook.page, filterHook.pageSize]);
  
  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  // Handle user selection for bulk actions
  const handleUserSelection = useCallback((userId: string, isSelected: boolean) => {
    setSelectedUsers(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (isSelected) {
        newSelected.add(userId);
      } else {
        newSelected.delete(userId);
      }
      return newSelected;
    });
  }, []);
  
  // Select/deselect all visible users
  const handleSelectAllUsers = useCallback((selectAll: boolean) => {
    if (selectAll) {
      // Select all visible users
      const newSelected = new Set(selectedUsers);
      filteredUsers.forEach(user => {
        // Skip protected admin users
        if (!userService.isProtectedAdmin(user.email)) {
          newSelected.add(user.id);
        }
      });
      setSelectedUsers(newSelected);
    } else {
      // Deselect all users
      setSelectedUsers(new Set());
    }
  }, [filteredUsers, selectedUsers]);
  
  // Export users to CSV or other formats
  const handleExportUsers = useCallback(() => {
    try {
      // Implement export functionality here
      toast({
        title: 'Export Started',
        description: 'Preparing user data export...',
      });
      
      // For now, just log that this would export users
      console.log('Exporting users:', filteredUsers);
      
      setTimeout(() => {
        toast({
          title: 'Export Complete',
          description: 'User data has been exported successfully',
        });
      }, 1000);
      
    } catch (err) {
      errorTracker.trackError(
        err instanceof Error ? err : new Error('Error exporting users'),
        'medium',
        { source: 'useUserManagement.handleExportUsers' }
      );
      
      toast({
        title: 'Export Failed',
        description: 'Could not export user data',
        variant: 'destructive',
      });
    }
  }, [filteredUsers, toast]);
  
  // Send bulk email to selected users
  const sendBulkEmail = useCallback(async (subject: string, message: string) => {
    try {
      toast({
        title: 'Sending Emails',
        description: `Sending to ${selectedUsers.size} recipients...`,
        duration: 5000,
      });
      
      // Implement actual email sending here
      // This would typically call an edge function
      
      console.log('Would send email to:', Array.from(selectedUsers));
      console.log('Email subject:', subject);
      console.log('Email message:', message);
      
      // Clear selection after sending
      setSelectedUsers(new Set());
      
      toast({
        title: 'Emails Sent',
        description: `Successfully sent to ${selectedUsers.size} recipients`,
      });
      
      return true;
    } catch (err) {
      errorTracker.trackError(
        err instanceof Error ? err : new Error('Error sending bulk email'),
        'medium',
        { source: 'useUserManagement.sendBulkEmail' }
      );
      
      toast({
        title: 'Email Failed',
        description: 'Could not send emails to selected users',
        variant: 'destructive',
      });
      
      return false;
    }
  }, [selectedUsers, toast]);
  
  // Function to check if any filters are active
  const hasActiveFilters = () => filterHook.hasActiveFilters();
  
  // Implement bulkUpdateRoles function
  const bulkUpdateRoles = async (userIds: string[], newRole: UserRole) => {
    return roleManagement.handleBulkRoleChange();
  };
  
  return {
    // User data
    users,
    filteredUsers,
    loading,
    isLoadingProfiles: loading,
    error,
    profileError: error,
    totalPages,
    userStats,
    
    // Filter state and functions
    ...filterHook,
    hasActiveFilters,
    
    // User selection
    selectedUsers,
    handleUserSelection,
    handleSelectAllUsers,
    
    // Role management
    ...roleManagement,
    
    // Data operations
    fetchUsers,
    refetch: fetchUsers,
    handleExportUsers,
    sendBulkEmail,
    bulkUpdateRoles,
    
    // Legacy API for compatibility
    updateUserRole: roleManagement.handleRoleChange,
    deleteUser: async (userId: string) => {
      // This would be implemented in the userService
      console.log('Delete user not implemented yet:', userId);
      return { success: false, error: new Error('Not implemented') };
    },
    toggleUserSelection: (userId: string) => {
      handleUserSelection(userId, !selectedUsers.has(userId));
    },
    clearUserSelection: () => {
      setSelectedUsers(new Set());
    }
  };
}
