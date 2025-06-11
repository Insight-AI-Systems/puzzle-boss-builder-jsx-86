
import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminProfiles } from '@/hooks/useAdminProfiles';
import { useClerkAuth } from '@/hooks/useClerkAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { useRealTimeUserUpdates } from '@/hooks/admin/useRealTimeUserUpdates';
import { UserRole } from '@/types/userTypes';
import { AdminUserTable } from './AdminUserTable';
import { AdminUserFilters } from './AdminUserFilters';
import { AdminUserActions } from './AdminUserActions';
import { AdminUserStats } from './AdminUserStats';
import { useAdminUserManagement } from '@/hooks/admin/useAdminUserManagement';

export const UserManagement: React.FC = () => {
  const { profile, userRole, isAdmin } = useClerkAuth();
  const { canManageUsers } = usePermissions();
  
  // Enable real-time updates
  useRealTimeUserUpdates(isAdmin);
  
  // Use the comprehensive user management hook
  const {
    // Data
    users,
    totalCount,
    isLoading,
    error,
    stats,
    
    // Pagination
    currentPage,
    pageSize,
    totalPages,
    setPage,
    setPageSize,
    
    // Filters and Search
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
    sortBy,
    setSortBy,
    sortOrder,
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
  } = useAdminUserManagement(isAdmin, profile?.id || null);

  const [activeTab, setActiveTab] = useState('all');

  if (!canManageUsers()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You don't have permission to manage users.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Statistics */}
      <AdminUserStats stats={stats} isLoading={isLoading} />
      
      {/* Main User Management */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Advanced Filters */}
          <AdminUserFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            roleFilter={roleFilter}
            onRoleFilterChange={setRoleFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            availableCountries={availableCountries}
            availableRoles={availableRoles}
            onRefresh={refreshData}
          />

          {/* Action Bar */}
          <AdminUserActions
            selectedUsers={selectedUsers}
            onBulkRoleChange={handleBulkRoleChange}
            onBulkEmail={handleBulkEmail}
            onExport={handleExportUsers}
            onClearSelection={clearSelection}
            totalUsers={totalCount}
            currentUserRole={userRole as UserRole}
          />

          {/* User Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Users ({totalCount})</TabsTrigger>
              <TabsTrigger value="admins">Admins ({stats?.adminCount || 0})</TabsTrigger>
              <TabsTrigger value="players">Players ({stats?.playerCount || 0})</TabsTrigger>
              <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <AdminUserTable
                users={users}
                isLoading={isLoading}
                error={error}
                selectedUsers={selectedUsers}
                onUserSelection={handleUserSelection}
                onSelectAll={handleSelectAll}
                onRoleChange={handleRoleChange}
                currentUserRole={userRole as UserRole}
                currentUserEmail={profile?.email}
                // Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalCount={totalCount}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            </TabsContent>
            
            <TabsContent value="admins" className="space-y-4">
              <AdminUserTable
                users={users.filter(user => ['super_admin', 'admin', 'category_manager', 'social_media_manager', 'partner_manager', 'cfo'].includes(user.role))}
                isLoading={isLoading}
                error={error}
                selectedUsers={selectedUsers}
                onUserSelection={handleUserSelection}
                onSelectAll={handleSelectAll}
                onRoleChange={handleRoleChange}
                currentUserRole={userRole as UserRole}
                currentUserEmail={profile?.email}
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalCount={totalCount}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            </TabsContent>
            
            <TabsContent value="players" className="space-y-4">
              <AdminUserTable
                users={users.filter(user => user.role === 'player')}
                isLoading={isLoading}
                error={error}
                selectedUsers={selectedUsers}
                onUserSelection={handleUserSelection}
                onSelectAll={handleSelectAll}
                onRoleChange={handleRoleChange}
                currentUserRole={userRole as UserRole}
                currentUserEmail={profile?.email}
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalCount={totalCount}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            </TabsContent>
            
            <TabsContent value="recent" className="space-y-4">
              <AdminUserTable
                users={users.filter(user => {
                  const lastSignIn = user.last_sign_in ? new Date(user.last_sign_in) : null;
                  const sevenDaysAgo = new Date();
                  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                  return lastSignIn && lastSignIn > sevenDaysAgo;
                })}
                isLoading={isLoading}
                error={error}
                selectedUsers={selectedUsers}
                onUserSelection={handleUserSelection}
                onSelectAll={handleSelectAll}
                onRoleChange={handleRoleChange}
                currentUserRole={userRole as UserRole}
                currentUserEmail={profile?.email}
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalCount={totalCount}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
