import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UsersTable } from './UsersTable';
import { UserTableFilters } from './UserTableFilters';
import { UserActions } from './UserActions';
import { UserPagination } from './UserPagination';
import { UserTypeToggle } from './UserTypeToggle';
import { AdminProfileEditDialog } from './AdminProfileEditDialog';
import { useUserManagement } from '@/hooks/admin/useUserManagement';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { EmailDialog } from './EmailDialog';
import { BulkRoleDialog } from './BulkRoleDialog';
import { MemberInsightsDashboard } from './MemberInsightsDashboard';
import { UserRole, UserProfile } from '@/types/userTypes';
import { validateUserRole } from '@/utils/typeValidation/roleValidators';

export const UserManagement: React.FC = () => {
  const { user, userRole: authUserRole } = useAuth();
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [confirmRoleDialogOpen, setConfirmRoleDialogOpen] = useState(false);
  const [profileEditDialogOpen, setProfileEditDialogOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<UserProfile | null>(null);
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  
  const userRole = authUserRole || 'player';
  const isAdmin = userRole === 'admin' || userRole === 'super_admin';
  const userId = user?.id || null;
  
  const userManagement = useUserManagement(isAdmin, userId);
  
  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    userManagement.setSearchTerm(localSearchTerm);
  };

  // Handle sending bulk emails
  const handleSendBulkEmail = async (subject: string, message: string) => {
    if (userManagement.sendBulkEmail) {
      try {
        await userManagement.sendBulkEmail(subject, message);
        setEmailDialogOpen(false);
      } catch (error) {
        console.error('Failed to send bulk email:', error);
      }
    }
  };

  // Type-safe bulk role change handler
  const handleBulkRoleChange = async () => {
    if (userManagement.bulkRole && userManagement.bulkUpdateRoles && userManagement.selectedUsers.size > 0) {
      try {
        await userManagement.bulkUpdateRoles(Array.from(userManagement.selectedUsers), userManagement.bulkRole);
        setConfirmRoleDialogOpen(false);
      } catch (error) {
        console.error('Failed to update roles:', error);
      }
    }
  };

  // Type-safe role setter that properly handles string input from the UI
  const handleSetBulkRole = (role: UserRole | null) => {
    // This function now correctly accepts UserRole | null which matches the BulkRoleDialog interface
    userManagement.setBulkRole(role);
  };

  // Type-safe role filter handler that converts string to UserRole | null
  const handleRoleFilterChange = (roleString: string) => {
    const validatedRole = validateUserRole(roleString);
    userManagement.setSelectedRole(validatedRole);
  };

  // Handle opening profile edit dialog
  const handleEditProfile = (user: UserProfile) => {
    setSelectedUserForEdit(user);
    setProfileEditDialogOpen(true);
  };

  // Handle closing profile edit dialog
  const handleCloseProfileEdit = () => {
    setProfileEditDialogOpen(false);
    setSelectedUserForEdit(null);
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">You do not have permission to access member management.</p>
        </CardContent>
      </Card>
    );
  }

  if (userManagement.isLoadingProfiles) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading member data...</p>
        </CardContent>
      </Card>
    );
  }

  if (userManagement.profileError) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-red-500">Error loading members: {userManagement.profileError.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Member Management</CardTitle>
          <CardDescription>Manage member accounts, permissions, and access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Member insights dashboard */}
          {userManagement.userStats && (
            <MemberInsightsDashboard 
              memberStats={userManagement.userStats} 
              signupStats={userManagement.allProfilesData?.signup_stats || []} 
            />
          )}
          
          {/* Member type toggle */}
          <UserTypeToggle 
            value={userManagement.userType} 
            onChange={userManagement.setUserType} 
          />
          
          {/* Member filters and actions */}
          <UserTableFilters
            onDateRangeChange={(range) => userManagement.setDateRange(range)}
            onCountryChange={(country) => userManagement.setSelectedCountry(country)}
            onCategoryChange={(category) => userManagement.setSelectedCategory(category)}
            onRoleChange={handleRoleFilterChange}
            countries={userManagement.allProfilesData?.countries || []}
            categories={userManagement.allProfilesData?.categories || []}
            dateRange={userManagement.dateRange}
          />
          
          {/* Member actions */}
          <UserActions
            localSearchTerm={localSearchTerm}
            setLocalSearchTerm={setLocalSearchTerm}
            handleSearchSubmit={handleSearchSubmit}
            selectedUsers={userManagement.selectedUsers}
            setEmailDialogOpen={setEmailDialogOpen}
            setConfirmRoleDialogOpen={setConfirmRoleDialogOpen}
            handleExportUsers={userManagement.handleExportUsers}
          />
          
          {/* Members table */}
          {userManagement.allProfilesData?.data && (
            <UsersTable
              users={userManagement.allProfilesData.data}
              currentUserRole={userRole}
              currentUserEmail={user?.email}
              onSortByRole={() => {}} // Implement if needed
              selectedUsers={userManagement.selectedUsers}
              onUserSelection={userManagement.handleUserSelection}
              onSelectAll={userManagement.handleSelectAllUsers}
              onEditProfile={handleEditProfile}
            />
          )}
          
          {/* Pagination */}
          <UserPagination
            page={userManagement.page}
            totalPages={userManagement.totalPages}
            onPageChange={userManagement.setPage}
            pageSize={userManagement.pageSize}
            onPageSizeChange={userManagement.setPageSize}
            currentCount={userManagement.allProfilesData?.data?.length || 0}
            totalCount={userManagement.allProfilesData?.count || 0}
          />
        </CardContent>
      </Card>

      {/* Profile Edit Dialog */}
      {selectedUserForEdit && (
        <AdminProfileEditDialog
          open={profileEditDialogOpen}
          onOpenChange={handleCloseProfileEdit}
          user={selectedUserForEdit}
          currentUserRole={userRole}
        />
      )}

      {/* Email Dialog */}
      <EmailDialog 
        open={emailDialogOpen} 
        onOpenChange={setEmailDialogOpen}
        selectedCount={userManagement.selectedUsers.size}
        onSend={handleSendBulkEmail}
      />
      
      {/* Role Update Dialog */}
      <BulkRoleDialog
        open={confirmRoleDialogOpen}
        onOpenChange={setConfirmRoleDialogOpen}
        selectedCount={userManagement.selectedUsers.size}
        bulkRole={userManagement.bulkRole}
        setBulkRole={handleSetBulkRole}
        onUpdateRoles={handleBulkRoleChange}
        isUpdating={userManagement.isBulkRoleChanging}
      />
    </div>
  );
};

export default UserManagement;
