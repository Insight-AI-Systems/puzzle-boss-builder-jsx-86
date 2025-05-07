
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UsersTable } from './UsersTable';
import { UserTableFilters } from './UserTableFilters';
import { UserActions } from './UserActions';
import { UserPagination } from './UserPagination';
import { UserTypeToggle } from './UserTypeToggle';
import { useUserManagement } from '@/hooks/admin/useUserManagement';
import { useAuth } from '@/hooks/auth/useAuth';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { EmailDialog } from './EmailDialog';
import { BulkRoleDialog } from './BulkRoleDialog';
import { UserInsightsDashboard } from './UserInsightsDashboard';
import { UserRole } from '@/types/userTypes';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';

export const UserManagement: React.FC = () => {
  const { user, userRole } = useAuth();
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [confirmRoleDialogOpen, setConfirmRoleDialogOpen] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [adminTestComplete, setAdminTestComplete] = useState(false);
  const [isTestingAdmin, setIsTestingAdmin] = useState(false);
  const [adminTestResult, setAdminTestResult] = useState<{success: boolean, message: string} | null>(null);
  
  // Check if user is admin through explicit roles
  const isAdmin = userRole === 'admin' || userRole === 'super_admin';
  const userId = user?.id || null;
  
  // Test if admin access is working
  const testAdminAccess = async () => {
    setIsTestingAdmin(true);
    try {
      const result = await supabase.functions.invoke('get-all-users', {
        method: 'GET'
      });
      
      if (result.error) {
        console.error("Admin access test failed:", result.error);
        setAdminTestResult({ 
          success: false, 
          message: `Admin check failed: ${result.error.message || 'Unknown error'}` 
        });
      } else {
        console.log("Admin access test succeeded:", result);
        setAdminTestResult({ 
          success: true, 
          message: `Admin check successful. Found ${result.data?.length || 0} users.` 
        });
      }
    } catch (error) {
      console.error("Error testing admin access:", error);
      setAdminTestResult({ 
        success: false, 
        message: `Error testing admin access: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setIsTestingAdmin(false);
      setAdminTestComplete(true);
    }
  };

  // Auto-run admin test once when component mounts
  useEffect(() => {
    if (isAdmin && userId && !adminTestComplete && !isTestingAdmin) {
      testAdminAccess();
    }
  }, [isAdmin, userId, adminTestComplete, isTestingAdmin]);
  
  const {
    // Filter state
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    pageSize,
    filterOptions,
    totalPages,
    userType,
    setUserType,
    
    // User data
    allProfilesData,
    isLoadingProfiles,
    profileError,
    userStats,
    
    // Selection
    selectedUsers,
    handleUserSelection,
    handleSelectAllUsers,
    setSelectedUsers,
    
    // Actions
    handleExportUsers,
    sendBulkEmail,
    bulkUpdateRoles,
    handleRoleChange,
    
    // Bulk role state
    bulkRole,
    setBulkRole,
    isBulkRoleChanging,
    
    // Sorting
    lastLoginSortDirection,
    setLastLoginSortDirection,
    
    // Refetch
    refetch
  } = useUserManagement(isAdmin, userId);
  
  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(localSearchTerm);
  };

  // Handle sending bulk emails
  const handleSendBulkEmail = (subject: string, message: string) => {
    if (sendBulkEmail) {
      sendBulkEmail(subject, message);
      setEmailDialogOpen(false);
    }
  };

  // Handle bulk role updates
  const handleBulkRoleChange = () => {
    if (bulkUpdateRoles && bulkRole) {
      bulkUpdateRoles(Array.from(selectedUsers), bulkRole);
      setConfirmRoleDialogOpen(false);
    }
  };

  if (profileError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Error loading user data</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {profileError.message || "An error occurred while loading user data."}
            </AlertDescription>
          </Alert>
          <div className="flex flex-col space-y-4">
            <Button onClick={() => refetch()} className="mt-2 w-full sm:w-auto">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            {!adminTestComplete && (
              <Button 
                onClick={testAdminAccess} 
                disabled={isTestingAdmin}
                variant="outline" 
                className="w-full sm:w-auto"
              >
                {isTestingAdmin ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertCircle className="mr-2 h-4 w-4" />}
                Test Admin Access
              </Button>
            )}
          </div>
          
          {adminTestResult && (
            <Alert className="mt-4" variant={adminTestResult.success ? "default" : "destructive"}>
              <AlertTitle>{adminTestResult.success ? "Admin Access Test Successful" : "Admin Access Test Failed"}</AlertTitle>
              <AlertDescription>
                {adminTestResult.message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage user accounts, permissions, and access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User insights dashboard */}
          {userStats && <UserInsightsDashboard userStats={userStats} signupStats={allProfilesData?.signup_stats || []} />}
          
          {/* User type toggle */}
          <UserTypeToggle 
            value={userType} 
            onChange={setUserType} 
          />
          
          {/* User filters and actions */}
          <UserTableFilters
            onDateRangeChange={(range) => console.log("Date range changed", range)}
            onCountryChange={(country) => console.log("Country changed", country)}
            onCategoryChange={(category) => console.log("Category changed", category)}
            onRoleChange={(role) => console.log("Role filter changed", role)}
            countries={allProfilesData?.countries || []}
            categories={allProfilesData?.categories || []}
            dateRange={undefined}
          />
          
          {/* User actions */}
          <UserActions
            localSearchTerm={localSearchTerm}
            setLocalSearchTerm={setLocalSearchTerm}
            handleSearchSubmit={handleSearchSubmit}
            selectedUsers={selectedUsers}
            setEmailDialogOpen={setEmailDialogOpen}
            setConfirmRoleDialogOpen={setConfirmRoleDialogOpen}
            handleExportUsers={handleExportUsers}
          />
          
          {/* Loading state */}
          {isLoadingProfiles ? (
            <div className="flex justify-center p-8">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
          ) : (
            <>
              {/* User table */}
              {allProfilesData?.data && (
                <UsersTable
                  users={allProfilesData.data}
                  currentUserRole={userRole || 'player'}
                  currentUserEmail={user?.email || undefined}
                  onRoleChange={handleRoleChange}
                  onSortByRole={() => console.log("Sort by role")}
                  onSortByLastLogin={setLastLoginSortDirection}
                  selectedUsers={selectedUsers}
                  onUserSelection={handleUserSelection}
                  onSelectAll={handleSelectAllUsers}
                  lastLoginSortDirection={lastLoginSortDirection}
                  onRefresh={() => refetch()}
                />
              )}
              
              {/* No data loaded yet message */}
              {(!allProfilesData || !allProfilesData.data) && !isLoadingProfiles && (
                <Alert className="my-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No Users Found</AlertTitle>
                  <AlertDescription className="flex flex-col gap-4">
                    <p>
                      No user data available. This may be due to database configuration, permissions,
                      or connectivity issues.
                    </p>
                    <div className="flex gap-2">
                      <Button onClick={() => refetch()} size="sm" className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Refresh Data
                      </Button>
                      <Button 
                        onClick={testAdminAccess} 
                        variant="outline" 
                        size="sm" 
                        disabled={isTestingAdmin}
                        className="flex items-center gap-2"
                      >
                        {isTestingAdmin ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertCircle className="h-4 w-4" />}
                        Test Admin Access
                      </Button>
                    </div>
                    
                    {adminTestResult && (
                      <div className={`text-sm ${adminTestResult.success ? "text-green-600" : "text-red-600"}`}>
                        {adminTestResult.message}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Pagination */}
              {allProfilesData && allProfilesData.data && allProfilesData.data.length > 0 && (
                <UserPagination
                  page={page}
                  setPage={setPage}
                  totalPages={totalPages}
                  currentCount={allProfilesData.data?.length || 0}
                  totalCount={allProfilesData.count}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Email Dialog */}
      <EmailDialog 
        open={emailDialogOpen} 
        onOpenChange={setEmailDialogOpen}
        selectedCount={selectedUsers.size}
        onSend={handleSendBulkEmail}
      />
      
      {/* Role Update Dialog */}
      <BulkRoleDialog
        open={confirmRoleDialogOpen}
        onOpenChange={setConfirmRoleDialogOpen}
        selectedCount={selectedUsers.size}
        bulkRole={bulkRole}
        setBulkRole={setBulkRole}
        onUpdateRoles={handleBulkRoleChange}
        isUpdating={isBulkRoleChanging}
      />
    </div>
  );
};

export default UserManagement;
