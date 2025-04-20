
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCog, Mail, Shield, Download, Filter, AlertTriangle } from "lucide-react";
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import { UserRole, ROLE_DEFINITIONS } from '@/types/userTypes';
import { SearchBar } from './user-management/SearchBar';
import { UsersTable } from './user-management/UsersTable';
import { UserTableFilters } from './user-management/UserTableFilters';
import { Button } from '@/components/ui/button';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { DateRange } from 'react-day-picker';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAdminProfiles } from '@/hooks/useAdminProfiles';

export function UserManagement() {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [roleSortDirection, setRoleSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [confirmRoleDialogOpen, setConfirmRoleDialogOpen] = useState(false);
  const [bulkRole, setBulkRole] = useState<UserRole>('player');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isBulkRoleChanging, setIsBulkRoleChanging] = useState(false);
  
  const pageSize = 10;
  
  const { 
    profile: currentUserProfile,
    isAdmin,
  } = useUserProfile();
  
  const {
    data: allProfilesData,
    isLoading: isLoadingProfiles,
    error: profileError,
    updateUserRole,
    bulkUpdateRoles,
    sendBulkEmail,
    refetch
  } = useAdminProfiles(
    isAdmin, 
    currentUserProfile?.id || null,
    {
      page,
      pageSize,
      searchTerm,
      dateRange,
      role: selectedRole,
      roleSortDirection,
      country: selectedCountry,
      category: selectedCategory
    }
  );
  
  const { toast } = useToast();
  const currentUserRole = currentUserProfile?.role || 'player';
  const totalPages = Math.ceil((allProfilesData?.count || 0) / pageSize);
  
  const countries = allProfilesData?.countries || [];
  const categories = allProfilesData?.categories || [];

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    updateUserRole.mutate(
      { userId, newRole },
      {
        onSuccess: () => {
          toast({
            title: "Role updated",
            description: `User role has been updated to ${newRole}`,
            duration: 3000,
          });
          refetch();
        },
        onError: (error) => {
          toast({
            title: "Role update failed",
            description: `Error: ${error instanceof Error ? error.message : 'You do not have permission to update this role.'}`,
            variant: 'destructive',
            duration: 5000,
          });
        }
      }
    );
  };
  
  const handleBulkRoleChange = async () => {
    if (selectedUsers.size === 0) {
      toast({
        title: "No users selected",
        description: "Please select at least one user to update roles",
        variant: 'destructive',
      });
      return;
    }
    
    setIsBulkRoleChanging(true);
    
    try {
      await bulkUpdateRoles.mutateAsync({ 
        userIds: Array.from(selectedUsers), 
        newRole: bulkRole 
      });
      
      toast({
        title: "Roles updated",
        description: `Updated ${selectedUsers.size} users to role: ${bulkRole}`,
        duration: 3000,
      });
      
      setSelectedUsers(new Set());
      refetch();
      setConfirmRoleDialogOpen(false);
    } catch (error) {
      toast({
        title: "Bulk role update failed",
        description: `Error: ${error instanceof Error ? error.message : 'An error occurred during the operation.'}`,
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsBulkRoleChanging(false);
    }
  };
  
  const handleBulkEmail = async () => {
    if (selectedUsers.size === 0) {
      toast({
        title: "No users selected",
        description: "Please select at least one user to email",
        variant: 'destructive',
      });
      return;
    }
    
    if (!emailSubject.trim() || !emailBody.trim()) {
      toast({
        title: "Missing email content",
        description: "Please provide both subject and body for the email",
        variant: 'destructive',
      });
      return;
    }
    
    setIsSendingEmail(true);
    
    try {
      await sendBulkEmail.mutateAsync({
        userIds: Array.from(selectedUsers),
        subject: emailSubject,
        body: emailBody
      });
      
      toast({
        title: "Emails queued",
        description: `Emails to ${selectedUsers.size} users have been queued for delivery`,
        duration: 3000,
      });
      
      setEmailDialogOpen(false);
      setEmailSubject('');
      setEmailBody('');
      setSelectedUsers(new Set());
    } catch (error) {
      toast({
        title: "Email sending failed",
        description: `Error: ${error instanceof Error ? error.message : 'An error occurred while sending emails.'}`,
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleUserSelection = (userId: string, isSelected: boolean) => {
    const newSelection = new Set(selectedUsers);
    if (isSelected) {
      newSelection.add(userId);
    } else {
      newSelection.delete(userId);
    }
    setSelectedUsers(newSelection);
  };
  
  const handleSelectAllUsers = (isSelected: boolean) => {
    if (isSelected && allProfilesData?.data) {
      const allUserIds = allProfilesData.data.map(user => user.id);
      setSelectedUsers(new Set(allUserIds));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(0);
    
    if (term) {
      toast({
        title: "Searching users",
        description: `Searching for "${term}" in user records...`,
        duration: 2000,
      });
    }
  };

  const handleCountryChange = (country: string | null) => {
    setSelectedCountry(country !== 'all_countries' ? country : null);
    setPage(0);
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category !== 'all_categories' ? category : null);
    setPage(0);
  };

  const handleRoleFilter = (roleValue: string | null) => {
    const newRole = roleValue === 'all_roles' ? null : roleValue as UserRole;
    setSelectedRole(newRole);
    setPage(0);
  };

  const handleSortByRole = () => {
    setRoleSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleExportUsers = () => {
    if (!allProfilesData?.data || allProfilesData.data.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no users to export",
        variant: 'destructive',
      });
      return;
    }
    
    const headers = ["ID", "Email", "Display Name", "Role", "Country", "Categories", "Created At"];
    const rows = allProfilesData.data.map(user => [
      user.id,
      (user as any).email || 'N/A',
      user.display_name || 'N/A',
      user.role || 'player',
      user.country || 'Not specified',
      (user.categories_played || []).join(', '),
      new Date(user.created_at).toLocaleDateString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `users_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export successful",
      description: `Exported ${allProfilesData.data.length} user records`,
    });
  };

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
            <Button 
              onClick={() => refetch()} 
              className="mt-4 bg-red-600 hover:bg-red-700"
            >
              Try Again
            </Button>
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
              onSearch={handleSearch}
              placeholder="Search by email, name or ID..."
            />
            
            <div className="flex gap-2">
              {selectedUsers.size > 0 && (
                <>
                  <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span>Email Selected ({selectedUsers.size})</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Send Email to {selectedUsers.size} Users</DialogTitle>
                        <DialogDescription>
                          This will send an email to all selected users. Please compose your message carefully.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="subject">Email Subject</Label>
                          <Input 
                            id="subject" 
                            value={emailSubject} 
                            onChange={e => setEmailSubject(e.target.value)} 
                            placeholder="Enter email subject" 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="body">Email Body</Label>
                          <Textarea 
                            id="body" 
                            value={emailBody} 
                            onChange={e => setEmailBody(e.target.value)} 
                            placeholder="Write your message here..." 
                            rows={6} 
                          />
                        </div>
                      </div>
                      
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Important</AlertTitle>
                        <AlertDescription>
                          Sending bulk emails may be subject to anti-spam regulations. Ensure you have permission to contact these users.
                        </AlertDescription>
                      </Alert>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>Cancel</Button>
                        <Button 
                          onClick={handleBulkEmail} 
                          disabled={isSendingEmail || !emailSubject.trim() || !emailBody.trim()}
                        >
                          {isSendingEmail ? 'Sending...' : 'Send Email'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog open={confirmRoleDialogOpen} onOpenChange={setConfirmRoleDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Shield className="h-4 w-4" />
                        <span>Change Roles ({selectedUsers.size})</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Change Role for {selectedUsers.size} Users</DialogTitle>
                        <DialogDescription>
                          Select the new role to assign to all selected users.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="py-4">
                        <RadioGroup 
                          value={bulkRole} 
                          onValueChange={(value) => setBulkRole(value as UserRole)}
                          className="space-y-2"
                        >
                          {Object.entries(ROLE_DEFINITIONS).map(([role, roleDef]) => (
                            <div key={role} className="flex items-center space-x-2">
                              <RadioGroupItem value={role} id={`role-${role}`} />
                              <Label htmlFor={`role-${role}`}>{roleDef.label}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                      
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Warning</AlertTitle>
                        <AlertDescription>
                          This action will change the role for all selected users and cannot be undone in bulk.
                        </AlertDescription>
                      </Alert>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmRoleDialogOpen(false)}>Cancel</Button>
                        <Button 
                          onClick={handleBulkRoleChange} 
                          disabled={isBulkRoleChanging}
                        >
                          {isBulkRoleChanging ? 'Changing...' : 'Change Roles'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
            onCountryChange={handleCountryChange}
            onCategoryChange={handleCategoryChange}
            onRoleChange={handleRoleFilter}
            countries={countries}
            categories={categories}
            dateRange={dateRange}
          />
          
          <UsersTable 
            users={allProfilesData?.data || []}
            currentUserRole={currentUserRole}
            onRoleChange={handleRoleChange}
            onSortByRole={handleSortByRole}
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
    </Card>
  );
}
