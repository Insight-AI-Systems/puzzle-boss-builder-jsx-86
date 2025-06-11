
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole, ROLE_DEFINITIONS } from '@/types/userTypes';
import { Label } from "@/components/ui/label";

interface BulkRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUserIds: string[];
  currentRole: UserRole | null;
  onRoleChange: (role: UserRole) => void;
  onUpdateRoles: (userIds: string[], newRole: UserRole) => Promise<void>;
  isUpdating: boolean;
  currentUserRole: UserRole;
}

export function BulkRoleDialog({
  open,
  onOpenChange,
  selectedUserIds,
  currentRole,
  onRoleChange,
  onUpdateRoles,
  isUpdating,
  currentUserRole
}: BulkRoleDialogProps) {
  const handleUpdate = async () => {
    if (!currentRole) return;
    await onUpdateRoles(selectedUserIds, currentRole);
    onOpenChange(false);
  };

  const availableRoles = Object.keys(ROLE_DEFINITIONS).filter(role => {
    if (currentUserRole === 'super_admin') return true;
    return role !== 'super_admin';
  }) as UserRole[];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Update User Roles</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Updating roles for {selectedUserIds.length} selected users
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">New Role</Label>
            <Select value={currentRole || ''} onValueChange={onRoleChange}>
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdate} 
              disabled={!currentRole || isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Update Roles'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
