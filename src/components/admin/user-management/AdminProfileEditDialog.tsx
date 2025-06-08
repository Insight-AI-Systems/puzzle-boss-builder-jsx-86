
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AdminProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
}

export function AdminProfileEditDialog({ open, onOpenChange, userId }: AdminProfileEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User Profile</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p>Profile editing functionality is being developed.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
