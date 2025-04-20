import React from 'react';
import { UserRole } from '@/types/userTypes';
import { Card, CardContent } from "@/components/ui/card";
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserManagement } from '@/hooks/admin/useUserManagement';
import { UserManagementHeader } from './user-management/UserManagementHeader';
import { UserActionBar } from './user-management/UserActionBar';
import { UserTableFilters } from './user-management/UserTableFilters';
import { UsersTable } from './user-management/UsersTable';
import { UserPagination } from './user-management/UserPagination';
import { EmailDialog } from './user-management/EmailDialog';
import { BulkRoleDialog } from './user-management/BulkRoleDialog';
import { UserInsightsDashboard } from './user-management/UserInsightsDashboard';
import { ROLE_DEFINITIONS } from '@/types/userTypes';

export function UserManagement() {
  const { profile: currentUserProfile, isAdmin } = useUserProfile();
  
  const {
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    dateRange,
    setDateRange,
    selectedCountry,
    setSelectedCountry,
    selectedCategory,
    setSelectedCategory,
    selectedRole,
    setSelectedRole,
    roleSortDirection,
    setRoleSortDirection,
    selectedUsers,
    emailSubject,
    setEmailSubject,
    emailBody,
    setEmailBody,
    emailDialogOpen,
    setEmailDialogOpen,
    confirmRoleDialogOpen,
    setConfirmRoleDialogOpen,
    bulkRole,
    setBulkRole,
    isSendingEmail,
    isBulkRoleChanging,
    allProfilesData,
    isLoadingProfiles,
    profileError,
    handleRoleChange,
    handleBulkRoleChange,
    handleBulkEmail,
    handleExportUsers,
    handleUserSelection,
    handleSelectAllUsers,
    totalPages,
    userStats
  } = useUserManagement(isAdmin, currentUserProfile?.id || null);

  // Type-safe wrapper for setBulkRole that converts string to UserRole
  const handleSetBulkRole = (roleString: string) => {
    // Validate that the string is a valid UserRole before setting
    if (Object.keys(ROLE_DEFINITIONS).includes(roleString)) {
      setBulkRole(roleString as UserRole);
    } else {
      console.error(`Invalid role: ${roleString}`);
    }
  };

  if (isLoadingProfiles) {
    return (
      <Card className="w-full">
        <UserManagementHeader />
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-puzzle-aqua"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (profileError) {
    return (
      <Card className="w-full">
        <UserManagementHeader />
        <CardContent>
          <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-md">
            <h3 className="font-bold mb-2">Error fetching user data</h3>
            <p>{profileError instanceof Error ? profileError.message : 'An unknown error occurred'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <UserManagementHeader />
      <CardContent>
        <div className="space-y-6">
          <UserInsightsDashboard 
            userStats={userStats} 
            signupStats={allProfilesData?.signup_stats || []} 
          />
          
          <UserActionBar 
            onSearch={setSearchTerm}
            selectedUsers={selectedUsers}
            onEmailClick={() => setEmailDialogOpen(true)}
            onRoleClick={() => setConfirmRoleDialogOpen(true)}
            onExportClick={handleExportUsers}
          />
          
          <UserTableFilters
            onDateRangeChange={setDateRange}
            onCountryChange={setSelectedCountry}
            onCategoryChange={setSelectedCategory}
            onRoleChange={setSelectedRole}
            countries={allProfilesData?.countries || []}
            categories={allProfilesData?.categories || []}
            dateRange={dateRange}
            genders={allProfilesData?.genders || []}
          />
          
          <UsersTable 
            users={allProfilesData?.data || []}
            currentUserRole={currentUserProfile?.role || 'player'}
            onRoleChange={handleRoleChange}
            onSortByRole={() => setRoleSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
            selectedUsers={selectedUsers}
            onUserSelection={handleUserSelection}
            onSelectAll={handleSelectAllUsers}
          />
          
          <UserPagination 
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </CardContent>

      <EmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        selectedCount={selectedUsers.size}
        emailSubject={emailSubject}
        setEmailSubject={setEmailSubject}
        emailBody={emailBody}
        setEmailBody={setEmailBody}
        onSendEmail={handleBulkEmail}
        isSending={isSendingEmail}
      />

      <BulkRoleDialog
        open={confirmRoleDialogOpen}
        onOpenChange={setConfirmRoleDialogOpen}
        selectedCount={selectedUsers.size}
        bulkRole={bulkRole}
        setBulkRole={handleSetBulkRole}
        onUpdateRoles={handleBulkRoleChange}
        isUpdating={isBulkRoleChanging}
      />
    </Card>
  );
}
