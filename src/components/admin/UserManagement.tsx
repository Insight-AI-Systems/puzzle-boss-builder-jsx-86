
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Shield, Download, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserManagement } from '@/hooks/admin/useUserManagement';
import { SearchBar } from './user-management/SearchBar';
import { UserTableFilters } from './user-management/UserTableFilters';
import { UsersTable } from './user-management/UsersTable';
import { EmailDialog } from './user-management/EmailDialog';
import { BulkRoleDialog } from './user-management/BulkRoleDialog';
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";

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
    totalPages
  } = useUserManagement(isAdmin, currentUserProfile?.id || null);

  const currentUserRole = currentUserProfile?.role || 'player';
  
  if (isLoadingProfiles) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Loading user data...</CardDescription>
        </CardHeader>
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
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Error loading users</CardDescription>
        </CardHeader>
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
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserCog className="h-5 w-5 mr-2" />
          User Management
        </CardTitle>
        <CardDescription>
          Search and filter users by various criteria. For exact email matches, enter the complete email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 justify-between">
            <SearchBar 
              onSearch={setSearchTerm}
              placeholder="Search by email, name or ID..."
            />
            
            <div className="flex gap-2">
              {selectedUsers.size > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => setEmailDialogOpen(true)}
                  >
                    <Mail className="h-4 w-4" />
                    <span>Email Selected ({selectedUsers.size})</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => setConfirmRoleDialogOpen(true)}
                  >
                    <Shield className="h-4 w-4" />
                    <span>Change Roles ({selectedUsers.size})</span>
                  </Button>
                </>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleExportUsers}
              >
                <Download className="h-4 w-4" />
                <span>Export Users</span>
              </Button>
            </div>
          </div>
          
          <UserTableFilters
            onDateRangeChange={setDateRange}
            onCountryChange={setSelectedCountry}
            onCategoryChange={setSelectedCategory}
            onRoleChange={setSelectedRole}
            countries={allProfilesData?.countries || []}
            categories={allProfilesData?.categories || []}
            dateRange={dateRange}
          />
          
          <UsersTable 
            users={allProfilesData?.data || []}
            currentUserRole={currentUserRole}
            onRoleChange={handleRoleChange}
            onSortByRole={() => setRoleSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
            selectedUsers={selectedUsers}
            onUserSelection={handleUserSelection}
            onSelectAll={handleSelectAllUsers}
          />
          
          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="gap-1 pl-2.5"
                  >
                    <span>Previous</span>
                  </Button>
                </PaginationItem>
                <PaginationItem className="flex items-center">
                  <span className="text-sm">
                    Page {page + 1} of {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="gap-1 pr-2.5"
                  >
                    <span>Next</span>
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
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
        setBulkRole={setBulkRole}
        onUpdateRoles={handleBulkRoleChange}
        isUpdating={isBulkRoleChanging}
      />
    </Card>
  );
}
