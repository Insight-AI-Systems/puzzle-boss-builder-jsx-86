
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useUserManagement } from '@/hooks/admin/useUserManagement';
import { UserTypeToggle } from './UserTypeToggle';
import { UsersTable } from './UsersTable';
import { UserActionBar } from './UserActionBar';
import { UserTableFilters } from './UserTableFilters';
import { UserPagination } from './UserPagination';
import { UserStatsDisplay } from './UserStatsDisplay';
import { EmailDialog } from './EmailDialog';
import { BulkRoleDialog } from './BulkRoleDialog';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { UserRole } from '@/types/userTypes';

export function UserManagement() {
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const { user, hasRole } = useAuth();
  const isAdmin = hasRole('admin') || hasRole('super_admin');
  
  const {
    // Filters
    userType,
    setUserType,
    searchQuery,
    setSearchQuery,
    selectedRole,
    setSelectedRole,
    page,
    setPage,
    selectedCountry,
    setSelectedCountry,
    hasActiveFilters,
    // User data
    filteredUsers,
    isLoadingProfiles,
    profileError,
    totalPages,
    refetch,
    userStats,
    // Selection and bulk actions
    selectedUsers,
    handleUserSelection,
    handleSelectAllUsers,
    bulkRole,
    setBulkRole,
    isBulkRoleChanging,
    // Actions
    handleRoleChange,
    bulkUpdateRoles,
    sendBulkEmail,
    handleExportUsers
  } = useUserManagement(isAdmin, user?.id || null);

  // Function to get title text based on user type
  const getTitleText = () => {
    if (userType === 'admin') {
      return 'Admin & Manager Users';
    }
    return 'Regular Users';
  };

  // Show loading state
  if (isLoadingProfiles) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Loading user data...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center min-h-40">
          <LoadingSpinner size="lg" centered />
        </CardContent>
      </Card>
    );
  }

  // Show error state if there was an issue loading users
  if (profileError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Users</CardTitle>
          <CardDescription>
            There was a problem loading the user data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-800">
            <p>Error: {profileError.message || "Unknown error"}</p>
            <button 
              onClick={refetch}
              className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md text-red-800 font-medium"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{getTitleText()}</span>
          {userStats && (
            <span className="text-sm font-normal">
              {userType === 'admin' ? `${userStats.adminCount} total admins` : `${userStats.regularCount} total users`}
            </span>
          )}
        </CardTitle>
        <CardDescription>
          Manage user accounts and permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* User Type Toggle */}
        <UserTypeToggle 
          value={userType} 
          onChange={setUserType}
        />
        
        {/* Action Bar */}
        <UserActionBar 
          selectedCount={selectedUsers.size}
          onEmailSelected={() => setEmailDialogOpen(true)}
          onChangeRoleSelected={() => setRoleDialogOpen(true)}
          onExportUsers={handleExportUsers}
          onRefresh={refetch}
          showEmailOption={selectedUsers.size > 0}
          showRoleOption={selectedUsers.size > 0}
        />
        
        {/* Filters */}
        <UserTableFilters 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
          selectedCountry={selectedCountry}
          onCountryChange={setSelectedCountry}
          hasActiveFilters={hasActiveFilters()}
          onClearFilters={() => {
            setSearchQuery('');
            setSelectedRole(null);
            setSelectedCountry(null);
          }}
        />
        
        {/* Users Table */}
        <UsersTable 
          users={filteredUsers || []}
          isLoading={isLoadingProfiles}
          canAssignRole={(role: string, userId: string) => true} // Simplified implementation
          onRoleChange={handleRoleChange}
          selectedUsers={Array.from(selectedUsers)} // Convert Set to Array
          onSelectUser={handleUserSelection}
          onSelectAllUsers={handleSelectAllUsers}
          userType={userType as 'admin' | 'regular' | 'player'}
        />
        
        {/* Pagination */}
        {totalPages > 1 && (
          <UserPagination 
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
        
        {/* Stats Display (if needed) */}
        {userStats && (
          <div className="mt-8">
            <UserStatsDisplay stats={userStats} />
          </div>
        )}
        
        {/* Dialogs */}
        <EmailDialog 
          open={emailDialogOpen} 
          onOpenChange={setEmailDialogOpen}
          onSendEmail={sendBulkEmail}
          selectedCount={selectedUsers.size}
        />
        
        <BulkRoleDialog 
          open={roleDialogOpen}
          onOpenChange={setRoleDialogOpen}
          onSubmit={(role) => bulkUpdateRoles(Array.from(selectedUsers), role)}
          selectedRole={bulkRole}
          onSelectRole={setBulkRole}
          isLoading={isBulkRoleChanging}
          selectedCount={selectedUsers.size}
        />
      </CardContent>
    </Card>
  );
}

export default UserManagement;
