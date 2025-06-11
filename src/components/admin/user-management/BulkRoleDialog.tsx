
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRole, ROLE_DEFINITIONS } from '@/types/userTypes';

interface BulkRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

export const BulkRoleDialog: React.FC<BulkRoleDialogProps> = ({
  open,
  onOpenChange,
  selectedCount,
  currentRole,
  onRoleChange,
  onConfirm,
  isLoading
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirm();
    onOpenChange(false);
  };

  const availableRoles = Object.keys(ROLE_DEFINITIONS) as UserRole[];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Role for {selectedCount} Users</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="role">New Role</Label>
            <Select value={currentRole} onValueChange={onRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {ROLE_DEFINITIONS[role]?.label || role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Roles'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
