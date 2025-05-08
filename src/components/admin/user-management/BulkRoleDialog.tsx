
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle } from "lucide-react";
import { ROLE_DEFINITIONS, UserRole } from '@/types/userTypes';
import { RoleSelector } from './RoleSelector';

interface BulkRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (role: UserRole) => void;
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  isLoading: boolean;
  selectedCount: number;
}

export function BulkRoleDialog({
  open,
  onOpenChange,
  onSubmit,
  selectedRole,
  onSelectRole,
  isLoading,
  selectedCount
}: BulkRoleDialogProps) {
  const handleSubmit = () => {
    onSubmit(selectedRole);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Change Role for {selectedCount} {selectedCount === 1 ? 'User' : 'Users'}
          </DialogTitle>
          <DialogDescription>
            Select a new role to assign to all selected users.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <RoleSelector
            currentRole={selectedRole}
            onRoleChange={onSelectRole}
            label="Select Role"
          />
          
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800 flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Important Note</p>
              <p>
                This action will change the role for all {selectedCount} selected users.
                This operation cannot be undone without manual intervention.
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
            variant="default"
          >
            {isLoading ? 'Updating...' : 'Update Roles'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
