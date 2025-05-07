
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

export interface BulkRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  bulkRole?: UserRole | null;
  setBulkRole?: (role: UserRole) => void;
  onUpdateRoles?: () => void;
  isUpdating?: boolean;
  selectedRole: UserRole | null;
  onSelectRole: (role: UserRole) => void;
  isLoading: boolean;
  onSubmit: (role: UserRole) => Promise<void>;
}

export function BulkRoleDialog({
  open,
  onOpenChange,
  selectedCount,
  selectedRole,
  onSelectRole,
  onSubmit,
  isLoading
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

  const handleUpdateRoles = () => {
    if (selectedRole) {
      onSubmit(selectedRole);
    }
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
          <RadioGroup value={selectedRole || undefined} onValueChange={(value) => onSelectRole(value as UserRole)}>
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
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="default" 
            onClick={handleUpdateRoles}
            disabled={!selectedRole || isLoading}
          >
            {isLoading ? (
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
