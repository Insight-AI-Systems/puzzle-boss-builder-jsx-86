import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RoleSelector } from './RoleSelector';
import { UserRole } from '@/types/userTypes';
import { Loader2 } from 'lucide-react';

interface BulkRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  bulkRole: UserRole;
  setBulkRole: (role: UserRole) => void;
  onUpdateRoles: () => void;
  isUpdating: boolean;
}

export function BulkRoleDialog({
  open,
  onOpenChange,
  selectedCount,
  bulkRole,
  setBulkRole,
  onUpdateRoles,
  isUpdating
}: BulkRoleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update User Roles</DialogTitle>
          <DialogDescription>
            You are about to change the role for {selectedCount} selected user{selectedCount !== 1 ? 's' : ''}.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RoleSelector 
            currentRole={bulkRole}
            onRoleChange={setBulkRole} 
            label="Select the new role to assign" 
          />
        </div>

        <DialogFooter>
          <Button 
            variant="secondary" 
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button 
            variant="default" 
            onClick={onUpdateRoles}
            disabled={!bulkRole || isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              `Update ${selectedCount} user${selectedCount !== 1 ? 's' : ''}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
