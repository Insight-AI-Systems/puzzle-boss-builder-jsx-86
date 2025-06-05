
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UserRole } from '@/types/userTypes';
import { Loader2 } from 'lucide-react';
import { validateUserRole } from '@/utils/typeValidation/roleValidators';

interface BulkRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  bulkRole: UserRole | null;
  setBulkRole: (role: UserRole | null) => void;
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
  const roles: {value: UserRole, label: string}[] = [
    { value: 'player', label: 'Player' },
    { value: 'admin', label: 'Admin' },
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'category_manager', label: 'Category Manager' },
    { value: 'partner_manager', label: 'Partner Manager' },
    { value: 'social_media_manager', label: 'Social Media Manager' },
    { value: 'cfo', label: 'CFO' }
  ];

  // Type-safe role change handler with validation
  const handleRoleChange = (value: string) => {
    const validatedRole = validateUserRole(value);
    setBulkRole(validatedRole);
  };

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
          <RadioGroup value={bulkRole || undefined} onValueChange={handleRoleChange}>
            {roles.map((role) => (
              <div className="flex items-center space-x-2" key={role.value}>
                <RadioGroupItem value={role.value} id={`role-${role.value}`} />
                <Label htmlFor={`role-${role.value}`}>{role.label}</Label>
              </div>
            ))}
          </RadioGroup>
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
