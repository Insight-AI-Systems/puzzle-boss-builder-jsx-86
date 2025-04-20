
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/userTypes';

interface RoleHookProps {
  updateUserRole: any; // We'll keep the existing type from the parent
  bulkUpdateRoles: any;
  refetch: () => void;
  selectedUsers: Set<string>;
}

export function useUserRoles({ updateUserRole, bulkUpdateRoles, refetch, selectedUsers }: RoleHookProps) {
  const [confirmRoleDialogOpen, setConfirmRoleDialogOpen] = useState(false);
  const [bulkRole, setBulkRole] = useState<UserRole>('player');
  const [isBulkRoleChanging, setIsBulkRoleChanging] = useState(false);
  const { toast } = useToast();

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
        variant: 'destructive'
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
        duration: 3000
      });

      setConfirmRoleDialogOpen(false);
    } catch (error) {
      toast({
        title: "Bulk role update failed",
        description: `Error: ${error instanceof Error ? error.message : 'An error occurred during the operation.'}`,
        variant: 'destructive',
        duration: 5000
      });
    } finally {
      setIsBulkRoleChanging(false);
    }
  };

  return {
    confirmRoleDialogOpen,
    setConfirmRoleDialogOpen,
    bulkRole,
    setBulkRole,
    isBulkRoleChanging,
    handleRoleChange,
    handleBulkRoleChange
  };
}
