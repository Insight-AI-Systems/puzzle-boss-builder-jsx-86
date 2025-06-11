
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAdminProfiles } from '@/hooks/useAdminProfiles';
import { UserProfile, UserRole } from '@/types/userTypes';
import { useToast } from '@/hooks/use-toast';
import { DateRange } from 'react-day-picker';

interface UserFilters {
  searchTerm: string;
  roleFilter: UserRole | 'all';
  statusFilter: 'all' | 'active' | 'inactive';
  dateRange?: DateRange;
  sortBy: 'name' | 'email' | 'role' | 'created_at' | 'last_sign_in';
  sortOrder: 'asc' | 'desc';
}

interface UserStats {
  totalUsers: number;
  adminCount: number;
  playerCount: number;
  activeToday: number;
  newThisWeek: number;
}

export function useAdminUserManagement(isAdmin: boolean, currentUserId: string | null) {
  const { toast } = useToast();
  
  // Data from the real profiles hook
  const {
    data: profilesData,
    isLoading,
    error,
    updateUserRole,
    bulkUpdateRoles,
    sendBulkEmail,
    refetch
  } = useAdminProfiles(isAdmin, currentUserId);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  // Filter state
  const [filters, setFilters] = useState<UserFilters>({
    searchTerm: '',
    roleFilter: 'all',
    statusFilter: 'all',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  // Selection state
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  // Extract data from profiles response
  const allUsers = profilesData?.data || [];
  const totalCount = profilesData?.count || 0;

  // Calculate user statistics
  const stats: UserStats = useMemo(() => {
    const totalUsers = allUsers.length;
    const adminCount = allUsers.filter(user => 
      ['super_admin', 'admin', 'category_manager', 'social_media_manager', 'partner_manager', 'cfo'].includes(user.role)
    ).length;
    const playerCount = allUsers.filter(user => user.role === 'player').length;

    // Calculate active today (users who signed in today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeToday = allUsers.filter(user => {
      if (!user.last_sign_in) return false;
      const lastSignIn = new Date(user.last_sign_in);
      return lastSignIn >= today;
    }).length;

    // Calculate new users this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newThisWeek = allUsers.filter(user => {
      const createdAt = new Date(user.created_at);
      return createdAt >= oneWeekAgo;
    }).length;

    return {
      totalUsers,
      adminCount,
      playerCount,
      activeToday,
      newThisWeek
    };
  }, [allUsers]);

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let filtered = [...allUsers];

    // Search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.display_name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.id.toLowerCase().includes(searchLower)
      );
    }

    // Role filter
    if (filters.roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === filters.roleFilter);
    }

    // Status filter (active/inactive based on recent sign-in)
    if (filters.statusFilter !== 'all') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      filtered = filtered.filter(user => {
        const isActive = user.last_sign_in ? new Date(user.last_sign_in) > thirtyDaysAgo : false;
        return filters.statusFilter === 'active' ? isActive : !isActive;
      });
    }

    // Date range filter
    if (filters.dateRange?.from) {
      filtered = filtered.filter(user => {
        const createdAt = new Date(user.created_at);
        const fromDate = filters.dateRange!.from!;
        const toDate = filters.dateRange!.to || new Date();
        return createdAt >= fromDate && createdAt <= toDate;
      });
    }

    // Sort users
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (filters.sortBy) {
        case 'name':
          aValue = a.display_name || '';
          bValue = b.display_name || '';
          break;
        case 'email':
          aValue = a.email || '';
          bValue = b.email || '';
          break;
        case 'role':
          aValue = a.role;
          bValue = b.role;
          break;
        case 'created_at':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case 'last_sign_in':
          aValue = a.last_sign_in ? new Date(a.last_sign_in) : new Date(0);
          bValue = b.last_sign_in ? new Date(b.last_sign_in) : new Date(0);
          break;
        default:
          aValue = a.created_at;
          bValue = b.created_at;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [allUsers, filters]);

  // Paginated users
  const paginatedUsers = useMemo(() => {
    const startIndex = currentPage * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  // Available filter options
  const availableCountries = useMemo(() => 
    [...new Set(allUsers.map(user => user.country).filter(Boolean))],
    [allUsers]
  );

  const availableRoles = useMemo(() => 
    [...new Set(allUsers.map(user => user.role))],
    [allUsers]
  );

  // Filter update functions
  const setSearchTerm = useCallback((term: string) => {
    setFilters(prev => ({ ...prev, searchTerm: term }));
    setCurrentPage(0); // Reset to first page
  }, []);

  const setRoleFilter = useCallback((role: UserRole | 'all') => {
    setFilters(prev => ({ ...prev, roleFilter: role }));
    setCurrentPage(0);
  }, []);

  const setStatusFilter = useCallback((status: 'all' | 'active' | 'inactive') => {
    setFilters(prev => ({ ...prev, statusFilter: status }));
    setCurrentPage(0);
  }, []);

  const setDateRange = useCallback((range?: DateRange) => {
    setFilters(prev => ({ ...prev, dateRange: range }));
    setCurrentPage(0);
  }, []);

  const setSortBy = useCallback((sortBy: UserFilters['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy }));
  }, []);

  const setSortOrder = useCallback((sortOrder: 'asc' | 'desc') => {
    setFilters(prev => ({ ...prev, sortOrder }));
  }, []);

  // Pagination functions
  const setPage = useCallback((page: number) => {
    setCurrentPage(Math.max(0, Math.min(page, totalPages - 1)));
  }, [totalPages]);

  const setPageSizeCallback = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(0);
  }, []);

  // Selection functions
  const handleUserSelection = useCallback((userId: string, selected: boolean) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(userId);
      } else {
        newSet.delete(userId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback((selected: boolean) => {
    if (selected) {
      setSelectedUsers(new Set(paginatedUsers.map(user => user.id)));
    } else {
      setSelectedUsers(new Set());
    }
  }, [paginatedUsers]);

  const clearSelection = useCallback(() => {
    setSelectedUsers(new Set());
  }, []);

  // Action functions
  const handleRoleChange = useCallback(async (userId: string, newRole: UserRole) => {
    try {
      await updateUserRole.mutateAsync({ userId, newRole });
      toast({
        title: "Role Updated",
        description: "User role has been updated successfully",
      });
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  }, [updateUserRole, toast]);

  const handleBulkRoleChange = useCallback(async (userIds: string[], newRole: UserRole) => {
    try {
      await bulkUpdateRoles.mutateAsync({ userIds, newRole });
      clearSelection();
      toast({
        title: "Roles Updated",
        description: `Updated roles for ${userIds.length} users`,
      });
    } catch (error) {
      console.error('Failed to bulk update roles:', error);
    }
  }, [bulkUpdateRoles, clearSelection, toast]);

  const handleBulkEmail = useCallback(async (userIds: string[], subject: string, body: string) => {
    try {
      await sendBulkEmail.mutateAsync({ userIds, subject, body });
      toast({
        title: "Emails Sent",
        description: `Sent emails to ${userIds.length} users`,
      });
    } catch (error) {
      console.error('Failed to send bulk email:', error);
    }
  }, [sendBulkEmail, toast]);

  const handleExportUsers = useCallback(() => {
    const csvContent = [
      ['ID', 'Email', 'Display Name', 'Role', 'Created At', 'Last Sign In'],
      ...selectedUsers.size > 0 
        ? allUsers.filter(user => selectedUsers.has(user.id)).map(user => [
            user.id,
            user.email || '',
            user.display_name || '',
            user.role,
            user.created_at,
            user.last_sign_in || ''
          ])
        : filteredUsers.map(user => [
            user.id,
            user.email || '',
            user.display_name || '',
            user.role,
            user.created_at,
            user.last_sign_in || ''
          ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "User data has been exported to CSV",
    });
  }, [selectedUsers, allUsers, filteredUsers, toast]);

  const refreshData = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    // Data
    users: paginatedUsers,
    totalCount: filteredUsers.length,
    allCount: totalCount,
    isLoading,
    error,
    stats,
    
    // Pagination
    currentPage,
    pageSize,
    totalPages,
    setPage,
    setPageSize: setPageSizeCallback,
    
    // Filters and Search
    searchTerm: filters.searchTerm,
    setSearchTerm,
    roleFilter: filters.roleFilter,
    setRoleFilter,
    statusFilter: filters.statusFilter,
    setStatusFilter,
    dateRange: filters.dateRange,
    setDateRange,
    sortBy: filters.sortBy,
    setSortBy,
    sortOrder: filters.sortOrder,
    setSortOrder,
    
    // Actions
    selectedUsers,
    handleUserSelection,
    handleSelectAll,
    clearSelection,
    handleRoleChange,
    handleBulkRoleChange,
    handleBulkEmail,
    handleExportUsers,
    refreshData,
    
    // Filter options
    availableCountries,
    availableRoles,
  };
}
