
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, ChevronDown } from "lucide-react";
import { UserProfile, UserRole, ROLE_DEFINITIONS } from '@/types/userTypes';
import { UserManagementHeader } from './user-management/UserManagementHeader';
import { UsersTable } from './user-management/UsersTable';
import { EmailDialog } from './user-management/EmailDialog';
import { UserStatsDisplay } from './user-management/UserStatsDisplay';
import { BulkRoleDialog } from './user-management/BulkRoleDialog';
import { useUserManagement } from '@/hooks/admin/useUserManagement';

export function UserManagement() {
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
    userStats
  } = useUserManagement(true, 'alan@insight-ai-systems.com');

  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(localSearchTerm);
  };

  // Handle sorting by role
  const handleSortByRole = () => {
    setRoleSortDirection(roleSortDirection === 'asc' ? 'desc' : 'asc');
  };

  // Handle selecting all users
  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const userIds = (allProfilesData?.data || []).map(user => user.id);
      setSelectedUsers(new Set(userIds));
    } else {
      setSelectedUsers(new Set());
    }
  };

  // Handle selecting a single user
  const handleUserSelection = (userId: string, isSelected: boolean) => {
    const newSelectedUsers = new Set(selectedUsers);
    if (isSelected) {
      newSelectedUsers.add(userId);
    } else {
      newSelectedUsers.delete(userId);
    }
    setSelectedUsers(newSelectedUsers);
  };

  // Function to handle email sending - stub implementation
  const handleBulkEmailSend = (subject: string, body: string) => {
    console.log(`Sending email with subject "${subject}" to ${selectedUsers.size} users`);
    setEmailDialogOpen(false);
  };

  return (
    <Card className="w-full">
      <UserManagementHeader />
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative flex flex-1 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email, name or ID..."
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                className="pl-8 bg-background/50"
              />
            </div>
            <Button type="submit" className="flex gap-2 items-center">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </form>
          
          <div className="flex gap-2">
            {selectedUsers.size > 0 && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setEmailDialogOpen(true)}
                  className="whitespace-nowrap"
                >
                  Email Selected ({selectedUsers.size})
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setConfirmRoleDialogOpen(true)}
                  className="whitespace-nowrap"
                >
                  Change Roles ({selectedUsers.size})
                </Button>
              </>
            )}
            <Button
              variant="outline"
              onClick={handleExportUsers}
              className="flex gap-1 items-center whitespace-nowrap"
            >
              <Download className="h-4 w-4" />
              Export Users
            </Button>
          </div>
        </div>
        
        <div>
          <Button 
            variant="outline" 
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex gap-1 items-center mb-4"
          >
            <Filter className="h-4 w-4" />
            Filters
            <ChevronDown className="h-4 w-4" />
          </Button>
          
          {filtersOpen && (
            <div className="bg-muted/50 p-4 rounded-md mb-4">
              <p>Advanced filters will appear here</p>
            </div>
          )}
        </div>

        {userStats && (
          <UserStatsDisplay stats={userStats} />
        )}

        <UsersTable
          users={allProfilesData?.data || []}
          currentUserRole="admin"
          onRoleChange={handleRoleChange}
          onSortByRole={handleSortByRole}
          selectedUsers={selectedUsers}
          onUserSelection={handleUserSelection}
          onSelectAll={handleSelectAll}
        />

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {(allProfilesData?.data || []).length} of {allProfilesData?.count || 0} users
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {page + 1} of {Math.max(1, totalPages)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
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
