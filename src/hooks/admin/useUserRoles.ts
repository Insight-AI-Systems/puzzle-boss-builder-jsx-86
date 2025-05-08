
import { useState } from 'react';
import { UserRole } from '@/types/userTypes';
import { useToast } from '@/hooks/use-toast';

type UseUserRolesProps = {
  updateUserRole: (userId: string, newRole: UserRole) => Promise<any>;
  bulkUpdateRoles: (userIds: string[], newRole: UserRole) => Promise<any>;
  refetch: () => Promise<any>;
  selectedUsers: Set<string>;
};

export function useUserRoles({ 
  updateUserRole,
  bulkUpdateRoles,
  refetch,
  selectedUsers 
}: UseUserRolesProps) {
  const [bulkRole, setBulkRole] = useState<UserRole>('player');
  const [confirmRoleDialogOpen, setConfirmRoleDialogOpen] = useState(false);
  const [isBulkRoleChanging, setIsBulkRoleChanging] = useState(false);
  const { toast } = useToast();

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await updateUserRole(userId, newRole);
      toast({
        title: "Role updated",
        description: `User's role has been changed to ${newRole}`,
      });
      refetch();
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Error updating role",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleBulkRoleChange = async () => {
    if (selectedUsers.size === 0) return;
    
    setIsBulkRoleChanging(true);
    try {
      await bulkUpdateRoles(Array.from(selectedUsers), bulkRole);
      toast({
        title: "Roles updated",
        description: `${selectedUsers.size} users have been updated to ${bulkRole}`,
      });
      setConfirmRoleDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Error updating roles:", error);
      toast({
        title: "Error updating roles",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsBulkRoleChanging(false);
    }
  };

  return {
    bulkRole,
    setBulkRole,
    confirmRoleDialogOpen,
    setConfirmRoleDialogOpen,
    isBulkRoleChanging,
    handleRoleChange,
    handleBulkRoleChange
  };
}
