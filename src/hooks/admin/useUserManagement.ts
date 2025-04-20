
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DateRange } from 'react-day-picker';
import { UserRole } from '@/types/userTypes';
import { useAdminProfiles } from './useAdminProfiles';
import { AdminProfilesOptions } from '@/types/adminTypes';

export function useUserManagement(isAdmin: boolean, currentUserId: string | null) {
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
  const { toast } = useToast();
  
  const options: AdminProfilesOptions = {
    page,
    pageSize,
    searchTerm,
    dateRange,
    role: selectedRole,
    roleSortDirection,
    country: selectedCountry,
    category: selectedCategory
  };

  const {
    data: allProfilesData,
    isLoading: isLoadingProfiles,
    error: profileError,
    updateUserRole,
    bulkUpdateRoles,
    sendBulkEmail,
    refetch
  } = useAdminProfiles(isAdmin, currentUserId, options);

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
      user.email || 'N/A',
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

  return {
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
    pageSize,
    allProfilesData,
    isLoadingProfiles,
    profileError,
    handleRoleChange,
    handleBulkRoleChange,
    handleBulkEmail,
    handleExportUsers,
    handleUserSelection,
    handleSelectAllUsers,
    totalPages: Math.ceil((allProfilesData?.count || 0) / pageSize)
  };
}
