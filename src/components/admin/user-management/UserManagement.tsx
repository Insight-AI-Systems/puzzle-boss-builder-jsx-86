
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Eye, Users, Search } from "lucide-react";
import { UserProfile, UserRole } from '@/types/userTypes';
import { useUserManagement } from '@/hooks/admin/useUserManagement';
import { useUserProfile } from '@/hooks/useUserProfile';
import { UserActionButtons } from './UserActionButtons';
import { UserFilters } from './UserFilters';
import { RoleSelector } from './RoleSelector';
import { EmailDialog } from './EmailDialog';
import { BulkRoleDialog } from './BulkRoleDialog';
import { MemberDetailView } from './MemberDetailView';
import { MemberDetailErrorBoundary } from './MemberDetailErrorBoundary';
import { UserLoginStatus } from './UserLoginStatus';

export function UserManagement() {
  const { profile: currentUserProfile } = useUserProfile();
  const [selectedMember, setSelectedMember] = useState<UserProfile | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);

  const isAdmin = currentUserProfile?.role === 'admin' || currentUserProfile?.role === 'super_admin';
  const currentUserId = currentUserProfile?.id || null;

  const {
    searchTerm,
    setSearchTerm,
    selectedUsers,
    setSelectedUsers,
    handleUserSelection,
    handleSelectAllUsers,
    allProfilesData,
    isLoadingProfiles,
    profileError,
    handleRoleChange,
    bulkUpdateRoles,
    sendBulkEmail,
    userStats,
    userType,
    setUserType,
    bulkRole,
    setBulkRole,
    isBulkRoleChanging
  } = useUserManagement(isAdmin, currentUserId);

  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isBulkRoleDialogOpen, setIsBulkRoleDialogOpen] = useState(false);

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>You don't have permission to access user management.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isLoadingProfiles) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Loading user data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (profileError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Users</CardTitle>
          <CardDescription>Failed to load user data. Please try again.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{profileError.message}</p>
        </CardContent>
      </Card>
    );
  }

  const users = allProfilesData?.data || [];

  const handleViewMember = (member: UserProfile) => {
    setSelectedMember(member);
    setIsDetailViewOpen(true);
  };

  const handleCloseDetailView = () => {
    setIsDetailViewOpen(false);
    setSelectedMember(null);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleSelectAllUsers(event.target.checked, users);
  };

  const handleUserSelectionChange = (userId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    handleUserSelection(userId, event.target.checked);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage user accounts, roles, and permissions. Total users: {userStats?.total || 0}
              </CardDescription>
            </div>
            <UserActionButtons
              selectedUsers={selectedUsers}
              onEmailClick={() => setIsEmailDialogOpen(true)}
              onRoleClick={() => setIsBulkRoleDialogOpen(true)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <UserFilters
              filterType={userType}
              setFilterType={setUserType}
              availableCountries={allProfilesData?.countries || []}
            />
          </div>

          {/* User Table */}
          <div className="border rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.size === users.length && users.length > 0}
                        onChange={handleSelectAllChange}
                        className="rounded"
                      />
                    </th>
                    <th className="text-left p-4 font-medium">User</th>
                    <th className="text-left p-4 font-medium">Role</th>
                    <th className="text-left p-4 font-medium">Last Sign In</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t hover:bg-muted/25">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.has(user.id)}
                          onChange={(e) => handleUserSelectionChange(user.id, e)}
                          className="rounded"
                        />
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">
                            {user.display_name || 'Anonymous User'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Member since {formatDate(user.created_at)}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <RoleSelector
                          currentRole={user.role}
                          onRoleChange={(newRole) => handleRoleChange(user.id, newRole)}
                          currentUserRole={(currentUserProfile?.role as UserRole) || 'player'}
                        />
                      </td>
                      <td className="p-4">
                        <UserLoginStatus 
                          lastSignIn={user.last_sign_in} 
                          createdAt={user.created_at}
                          displayName={user.display_name}
                          currentUserEmail={currentUserProfile?.email}
                          userEmail={user.email}
                        />
                      </td>
                      <td className="p-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewMember(user)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {users.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No users found matching your search.' : 'No users found.'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <EmailDialog
        open={isEmailDialogOpen}
        onOpenChange={setIsEmailDialogOpen}
        selectedUserIds={Array.from(selectedUsers)}
        onSendEmail={sendBulkEmail}
      />

      <BulkRoleDialog
        open={isBulkRoleDialogOpen}
        onOpenChange={setIsBulkRoleDialogOpen}
        selectedUserIds={Array.from(selectedUsers)}
        currentRole={(bulkRole as UserRole)}
        onRoleChange={setBulkRole}
        onUpdateRoles={bulkUpdateRoles}
        isUpdating={isBulkRoleChanging}
        currentUserRole={(currentUserProfile?.role as UserRole) || 'player'}
      />

      <MemberDetailErrorBoundary>
        <MemberDetailView
          member={selectedMember}
          isOpen={isDetailViewOpen}
          onClose={handleCloseDetailView}
        />
      </MemberDetailErrorBoundary>
    </div>
  );
}
