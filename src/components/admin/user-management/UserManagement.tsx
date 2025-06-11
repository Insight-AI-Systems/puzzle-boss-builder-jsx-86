
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useAdminProfiles } from '@/hooks/useAdminProfiles';
import { useRealTimeUserUpdates } from '@/hooks/admin/useRealTimeUserUpdates';
import { UserActionButtons } from './UserActionButtons';
import { UserFilters } from './UserFilters';
import { EmailDialog } from './EmailDialog';
import { BulkRoleDialog } from './BulkRoleDialog';
import { MemberDetailView } from './MemberDetailView';
import { MemberDetailErrorBoundary } from './MemberDetailErrorBoundary';
import { UsersTable } from './UsersTable';
import { Loader2, Search, Users, RefreshCw } from 'lucide-react';
import { UserRole } from '@/types/userTypes';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export const UserManagement = () => {
  const { user } = useAuth();
  const { canManageUsers, userRole } = usePermissions();
  const { toast } = useToast();
  const currentUserId = user?.id || null;

  console.log('🧑‍💼 UserManagement - Permission check:', {
    canManageUsers: canManageUsers(),
    userRole,
    currentUserId
  });

  // Use real data hook and real-time updates
  const {
    data: profilesData,
    isLoading: isLoadingProfiles,
    error: profileError,
    updateUserRole,
    bulkUpdateRoles,
    sendBulkEmail,
    refetch
  } = useAdminProfiles(canManageUsers(), currentUserId);

  // Set up real-time subscriptions
  useRealTimeUserUpdates(canManageUsers());

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [userType, setUserType] = useState('all');
  const [bulkRole, setBulkRole] = useState<UserRole>('player');
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const handleUserSelection = (userId: string, checked: boolean) => {
    const newSelected = new Set(selectedUsers);
    if (checked) {
      newSelected.add(userId);
    } else {
      newSelected.delete(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleSelectAllUsers = (checked: boolean) => {
    if (checked && filteredUsers) {
      setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await updateUserRole.mutateAsync({ userId, newRole });
      toast({
        title: "Role updated",
        description: "User role has been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error updating role",
        description: error.message || "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const handleEmailClick = () => {
    setShowEmailDialog(true);
  };

  const handleRoleClick = () => {
    setShowRoleDialog(true);
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshing data",
      description: "User data is being refreshed",
    });
  };

  const handleExportClick = () => {
    if (!filteredUsers?.length) {
      toast({
        title: "No data to export",
        description: "There are no users to export",
        variant: "destructive",
      });
      return;
    }

    // Create CSV content
    const headers = ['ID', 'Display Name', 'Email', 'Role', 'Country', 'Created At', 'Last Sign In'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => [
        user.id,
        user.display_name || '',
        user.email || '',
        user.role,
        user.country || '',
        user.created_at,
        user.last_sign_in || ''
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export completed",
      description: `Exported ${filteredUsers.length} users to CSV`,
    });
  };

  const handleEmailSend = async (subject: string, message: string) => {
    try {
      const userIds = Array.from(selectedUsers);
      await sendBulkEmail.mutateAsync({ userIds, subject, body: message });
      setShowEmailDialog(false);
      setSelectedUsers(new Set());
      toast({
        title: "Emails sent",
        description: "Bulk email has been sent successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error sending emails",
        description: error.message || "Failed to send bulk email",
        variant: "destructive",
      });
    }
  };

  const handleBulkRoleChange = async () => {
    try {
      const userIds = Array.from(selectedUsers);
      await bulkUpdateRoles.mutateAsync({ userIds, newRole: bulkRole });
      setShowRoleDialog(false);
      setSelectedUsers(new Set());
      toast({
        title: "Roles updated",
        description: "User roles have been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error updating roles",
        description: error.message || "Failed to update user roles",
        variant: "destructive",
      });
    }
  };

  // Check permissions first
  if (!canManageUsers()) {
    console.log('🚫 UserManagement - Access denied:', {
      canManageUsers: canManageUsers(),
      userRole,
      message: 'User does not have manage_users permission'
    });
    
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-red-500 text-lg font-semibold mb-2">Access Denied</div>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access user management.
            </p>
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
              <strong>Current Role:</strong> {userRole}<br/>
              <strong>Required Permission:</strong> manage_users<br/>
              <strong>Can Manage Users:</strong> {canManageUsers() ? 'Yes' : 'No'}
            </div>
          </div>
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
          <div className="text-center">
            <p className="text-destructive mb-4">Error loading users: {profileError.message}</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const users = profilesData?.data || [];
  const availableCountries = profilesData?.countries || [];

  // Filter users based on search term and user type
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = userType === 'all' || 
      (userType === 'admin' && ['super_admin', 'admin', 'category_manager', 'social_media_manager', 'partner_manager', 'cfo'].includes(user.role)) ||
      (userType === 'regular' && user.role === 'player');

    return matchesSearch && matchesType;
  });

  const userStats = {
    total: users.length,
    filtered: filteredUsers.length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions • Real-time updates enabled
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Total Users: {userStats.total}</span>
            {searchTerm || userType !== 'all' ? (
              <span>| Filtered: {userStats.filtered}</span>
            ) : null}
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name, email, or ID..."
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

          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No users found matching your criteria</p>
              {searchTerm && (
                <Button 
                  variant="ghost" 
                  onClick={() => setSearchTerm('')}
                  className="mt-2"
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <UsersTable
              users={filteredUsers}
              currentUserRole={userRole}
              currentUserEmail={user?.primaryEmailAddress?.emailAddress}
              onSortByRole={() => {
                // TODO: Implement sorting functionality
                console.log('Sort by role requested');
              }}
              selectedUsers={selectedUsers}
              onUserSelection={handleUserSelection}
              onSelectAll={handleSelectAllUsers}
              onEditProfile={setSelectedMember}
            />
          )}
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
        isLoading={bulkUpdateRoles.isPending}
      />
    </div>
  );
};
