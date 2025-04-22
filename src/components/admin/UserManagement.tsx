
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { UserStatsDisplay } from './user-management/UserStatsDisplay';
import { UsersTable } from './user-management/UsersTable';
import { EmailDialog } from './user-management/EmailDialog';
import { BulkRoleDialog } from './user-management/BulkRoleDialog';
import { UserActions } from './user-management/UserActions';
import { UserFilters } from './user-management/UserFilters';
import { UserPagination } from './user-management/UserPagination';
import { useUserManagement } from '@/hooks/admin/useUserManagement';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useQueryClient } from '@tanstack/react-query';

export function UserManagement() {
  const { profile } = useUserProfile();
  const queryClient = useQueryClient();
  
  const {
    allProfilesData,
    isLoadingProfiles,
    profileError,
    handleExportUsers,
    totalPages,
    page,
    setPage,
    pageSize,
    setPageSize,
    searchTerm,
    setSearchTerm,
    selectedUsers,
    setSelectedUsers,
    emailDialogOpen,
    setEmailDialogOpen,
    bulkRole,
    setBulkRole,
    confirmRoleDialogOpen,
    setConfirmRoleDialogOpen,
    isBulkRoleChanging,
    handleRoleChange,
    handleBulkRoleChange,
    roleSortDirection,
    setRoleSortDirection,
    userStats,
    lastLoginSortDirection,
    setLastLoginSortDirection
  } = useUserManagement(true, profile?.id || null);

  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const currentUserRole = profile?.role || 'player';
  const currentUserEmail = profile?.id; // In your system, id appears to be the email

  console.log('UserManagement - Current user:', {
    role: currentUserRole,
    email: currentUserEmail,
    profile
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(localSearchTerm);
  };

  const handleSortByRole = () => {
    setRoleSortDirection(roleSortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleSortByLastLogin = () => {
    setLastLoginSortDirection(lastLoginSortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected && allProfilesData?.data) {
      const userIds = allProfilesData.data.map(user => user.id);
      setSelectedUsers(new Set(userIds));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleUserSelection = (userId: string, isSelected: boolean) => {
    const newSelectedUsers = new Set(selectedUsers);
    if (isSelected) {
      newSelectedUsers.add(userId);
    } else {
      newSelectedUsers.delete(userId);
    }
    setSelectedUsers(newSelectedUsers);
  };

  const handleBulkEmailSend = (subject: string, body: string) => {
    console.log(`Sending email with subject "${subject}" to ${selectedUsers.size} users`);
    setEmailDialogOpen(false);
  };

  return (
    <Card className="w-full">
      <CardContent className="space-y-6">
        <UserActions
          localSearchTerm={localSearchTerm}
          setLocalSearchTerm={setLocalSearchTerm}
          handleSearchSubmit={handleSearchSubmit}
          selectedUsers={selectedUsers}
          setEmailDialogOpen={setEmailDialogOpen}
          setConfirmRoleDialogOpen={setConfirmRoleDialogOpen}
          handleExportUsers={handleExportUsers}
        />
        
        <UserFilters 
          filtersOpen={filtersOpen}
          setFiltersOpen={setFiltersOpen}
        />

        {userStats && (
          <UserStatsDisplay stats={userStats} />
        )}

        <UsersTable
          users={allProfilesData?.data || []}
          currentUserRole={currentUserRole}
          currentUserEmail={currentUserEmail}
          onRoleChange={handleRoleChange}
          onSortByRole={handleSortByRole}
          onSortByLastLogin={handleSortByLastLogin}
          selectedUsers={selectedUsers}
          onUserSelection={handleUserSelection}
          onSelectAll={handleSelectAll}
          lastLoginSortDirection={lastLoginSortDirection}
        />

        <UserPagination
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          currentCount={(allProfilesData?.data || []).length}
          totalCount={allProfilesData?.count || 0}
        />
      </CardContent>

      <EmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        selectedCount={selectedUsers.size}
        onSend={handleBulkEmailSend}
      />
      
      <BulkRoleDialog
        open={confirmRoleDialogOpen}
        onOpenChange={setConfirmRoleDialogOpen}
        selectedCount={selectedUsers.size}
        bulkRole={bulkRole}
        setBulkRole={setBulkRole}
        onUpdateRoles={handleBulkRoleChange}
        isUpdating={isBulkRoleChanging}
      />
    </Card>
  );
}
