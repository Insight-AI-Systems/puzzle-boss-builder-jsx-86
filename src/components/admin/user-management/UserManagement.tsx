
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UsersTable } from './UsersTable';
import { UserTableFilters } from './UserTableFilters';
import { UserActions } from './UserActions';
import { UserPagination } from './UserPagination';
import { UserTypeToggle } from './UserTypeToggle';
import { useUserManagement } from '@/hooks/admin/useUserManagement';
import { useAuth } from '@/hooks/auth/useAuth';
import { Loader2, AlertCircle, RefreshCw, Database, Users } from 'lucide-react';
import { EmailDialog } from './EmailDialog';
import { BulkRoleDialog } from './BulkRoleDialog';
import { UserInsightsDashboard } from './UserInsightsDashboard';
import { UserRole } from '@/types/userTypes';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const UserManagement: React.FC = () => {
  const { user, userRole } = useAuth();
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [confirmRoleDialogOpen, setConfirmRoleDialogOpen] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [adminTestComplete, setAdminTestComplete] = useState(false);
  const [isTestingAdmin, setIsTestingAdmin] = useState(false);
  const [adminTestResult, setAdminTestResult] = useState<{success: boolean, message: string} | null>(null);
  const [isDatabaseTesting, setIsDatabaseTesting] = useState(false);
  const [dbTestResult, setDbTestResult] = useState<{success: boolean, message: string} | null>(null);
  
  // Check if user is admin through explicit roles
  const isAdmin = userRole === 'admin' || userRole === 'super_admin';
  const isProtectedAdmin = user?.email === 'alan@insight-ai-systems.com';
  const userId = user?.id || null;
  
  // Test if database is accessible
  const testDatabaseAccess = async () => {
    setIsDatabaseTesting(true);
    try {
      // Try to select a count from profiles table
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error("Database access test failed:", error);
        setDbTestResult({ 
          success: false, 
          message: `Database check failed: ${error.message || 'Unknown error'}` 
        });
        
        // Try a simpler check with auth status
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        if (!authError && session) {
          setDbTestResult({ 
            success: false, 
            message: `Auth is working but database access failed: ${error.message}. You may need admin permissions.` 
          });
        }
      } else {
        console.log("Database access test succeeded:", { count });
        setDbTestResult({ 
          success: true, 
          message: `Database check successful. Found ${count} profiles.` 
        });
      }
    } catch (error) {
      console.error("Error testing database access:", error);
      setDbTestResult({ 
        success: false, 
        message: `Error testing database access: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setIsDatabaseTesting(false);
    }
  };
  
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
    if ((isAdmin || isProtectedAdmin) && userId && !adminTestComplete && !isTestingAdmin) {
      testAdminAccess();
    }
  }, [isAdmin, isProtectedAdmin, userId, adminTestComplete, isTestingAdmin]);
  
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
  } = useUserManagement(isAdmin || isProtectedAdmin, userId);
  
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

  // Force refetch with feedback
  const handleForceRefresh = () => {
    toast({
      title: "Refreshing user data",
      description: "Fetching the latest user information..."
    });
    refetch();
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
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => refetch()} className="mt-2">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button 
              onClick={testDatabaseAccess} 
              disabled={isDatabaseTesting}
              variant="outline" 
              className="mt-2"
            >
              {isDatabaseTesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
              Test Database Access
            </Button>
            <Button 
              onClick={testAdminAccess} 
              disabled={isTestingAdmin}
              variant="outline" 
              className="mt-2"
            >
              {isTestingAdmin ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertCircle className="mr-2 h-4 w-4" />}
              Test Admin Access
            </Button>
          </div>
          
          {dbTestResult && (
            <Alert className="mt-4" variant={dbTestResult.success ? "default" : "destructive"}>
              <AlertTitle>{dbTestResult.success ? "Database Test Successful" : "Database Test Failed"}</AlertTitle>
              <AlertDescription>
                {dbTestResult.message}
              </AlertDescription>
            </Alert>
          )}
          
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
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </div>
            <Button onClick={handleForceRefresh} size="sm" variant="outline" className="hidden sm:flex items-center gap-1">
              <RefreshCw className="h-3 w-3" />
              <span>Refresh</span>
            </Button>
          </CardTitle>
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
              {allProfilesData?.data && allProfilesData.data.length > 0 ? (
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
              ) : null}
              
              {/* No data loaded yet message */}
              {(!allProfilesData || !allProfilesData.data || allProfilesData.data.length === 0) && !isLoadingProfiles && (
                <Alert className="my-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No Users Found</AlertTitle>
                  <AlertDescription className="space-y-4">
                    <p>
                      No user data available. This may be due to database configuration, permissions,
                      or connectivity issues.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={() => refetch()} size="sm" className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Refresh Data
                      </Button>
                      <Button 
                        onClick={testDatabaseAccess} 
                        variant="outline" 
                        size="sm" 
                        disabled={isDatabaseTesting}
                        className="flex items-center gap-2"
                      >
                        {isDatabaseTesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
                        Test Database Connection
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
                    
                    {dbTestResult && (
                      <div className={`text-sm ${dbTestResult.success ? "text-green-600" : "text-red-600"}`}>
                        <strong>Database Test:</strong> {dbTestResult.message}
                      </div>
                    )}
                    
                    {adminTestResult && (
                      <div className={`text-sm ${adminTestResult.success ? "text-green-600" : "text-red-600"}`}>
                        <strong>Admin Access Test:</strong> {adminTestResult.message}
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
