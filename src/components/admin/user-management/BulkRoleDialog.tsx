
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserRole, ROLE_DEFINITIONS } from '@/types/userTypes';

interface BulkRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  bulkRole: UserRole;
  setBulkRole: (role: UserRole) => void; // Updated type to accept UserRole directly
  onUpdateRoles: () => void;
  isUpdating: boolean;
}

export const BulkRoleDialog: React.FC<BulkRoleDialogProps> = ({
  open,
  onOpenChange,
  selectedCount,
  bulkRole,
  setBulkRole,
  onUpdateRoles,
  isUpdating,
}) => {
  // This function converts the string value from RadioGroup to UserRole
  const handleRoleChange = (value: string) => {
    // Validate that the role is a valid UserRole
    if (Object.keys(ROLE_DEFINITIONS).includes(value)) {
      setBulkRole(value as UserRole);
    } else {
      console.error(`Invalid role: ${value}, defaulting to 'player'`);
      setBulkRole('player');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Role for {selectedCount} Users</DialogTitle>
          <DialogDescription>
            Select the new role to assign to all selected users.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup 
            value={bulkRole} 
            onValueChange={handleRoleChange}
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
        
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            This action will change the role for all selected users and cannot be undone in bulk.
          </AlertDescription>
        </Alert>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={onUpdateRoles} 
            disabled={isUpdating}
          >
            {isUpdating ? 'Changing...' : 'Change Roles'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
