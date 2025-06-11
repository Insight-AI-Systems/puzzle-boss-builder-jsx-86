
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useUserManagement } from '@/hooks/admin/useUserManagement';
import { UserActionButtons } from './UserActionButtons';
import { UserFilters } from './UserFilters';
import { EmailDialog } from './EmailDialog';
import { BulkRoleDialog } from './BulkRoleDialog';
import { MemberDetailView } from './MemberDetailView';
import { MemberDetailErrorBoundary } from './MemberDetailErrorBoundary';
import { Loader2, Search, Users } from 'lucide-react';
import { UserRole } from '@/types/userTypes';

export const UserManagement = () => {
  const { userRole, user } = useAuth();
  const isAdmin = userRole === 'admin';
  const currentUserId = user?.id || null;

  const {
    searchTerm,
    setSearchTerm,
    selectedUsers,
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

  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const handleEmailClick = () => {
    setShowEmailDialog(true);
  };

  const handleRoleClick = () => {
    setShowRoleDialog(true);
  };

  const handleExportClick = () => {
    console.log('Exporting user data...');
    // TODO: Implement export functionality
  };

  const handleEmailSend = async (subject: string, message: string) => {
    const userIds = Array.from(selectedUsers);
    await sendBulkEmail(userIds, subject, message);
    setShowEmailDialog(false);
  };

  const handleBulkRoleChange = async () => {
    const userIds = Array.from(selectedUsers);
    await bulkUpdateRoles(userIds, bulkRole);
    setShowRoleDialog(false);
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">You don't have permission to access user management.</p>
        </CardContent>
      </Card>
    );
  }

  if (selectedMember) {
    return (
      <MemberDetailErrorBoundary>
        <MemberDetailView 
          member={selectedMember} 
          onBack={() => setSelectedMember(null)}
          onRoleChange={handleRoleChange}
        />
      </MemberDetailErrorBoundary>
    );
  }

  if (isLoadingProfiles) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading users...</span>
        </CardContent>
      </Card>
    );
  }

  if (profileError) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">Error loading users: {profileError.message}</p>
        </CardContent>
      </Card>
    );
  }

  const users = allProfilesData?.data || [];
  const availableCountries = allProfilesData?.countries || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Total Users: {userStats.total}</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
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
              availableCountries={availableCountries}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <UserActionButtons
              selectedUsers={selectedUsers}
              onEmailClick={handleEmailClick}
              onRoleClick={handleRoleClick}
              onExportClick={handleExportClick}
            />
          </div>

          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>User management interface placeholder</p>
            <p className="text-sm">Selected users: {selectedUsers.size}</p>
          </div>
        </CardContent>
      </Card>

      <EmailDialog
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        onSend={handleEmailSend}
        selectedCount={selectedUsers.size}
      />

      <BulkRoleDialog
        open={showRoleDialog}
        onOpenChange={setShowRoleDialog}
        selectedCount={selectedUsers.size}
        currentRole={bulkRole}
        onRoleChange={setBulkRole}
        onConfirm={handleBulkRoleChange}
        isLoading={isBulkRoleChanging}
      />
    </div>
  );
};
