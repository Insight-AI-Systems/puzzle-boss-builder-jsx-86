
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserProfile, UserRole } from '@/types/userTypes';

interface AdminProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserProfile;
  currentUserRole: string;
  onRoleChange: (userId: string, newRole: UserRole) => Promise<void>;
}

export function AdminProfileEditDialog({ 
  open, 
  onOpenChange, 
  user, 
  currentUserRole, 
  onRoleChange 
}: AdminProfileEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User Profile</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">User ID: {user.id}</p>
              <p className="text-sm text-muted-foreground">Email: {user.email}</p>
              <p className="text-sm text-muted-foreground">Display Name: {user.display_name}</p>
              <p className="text-sm text-muted-foreground">Current Role: {user.role}</p>
            </div>
            <p>Profile editing functionality is being developed.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
