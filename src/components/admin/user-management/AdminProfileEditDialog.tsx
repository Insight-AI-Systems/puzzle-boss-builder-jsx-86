
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserProfile, UserRole } from '@/types/userTypes';
import { ProfileEditForm } from './ProfileEditForm';
import { useProfileUpdate } from '@/hooks/admin/useProfileUpdate';

interface AdminProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserProfile;
  currentUserRole: UserRole;
}

export function AdminProfileEditDialog({ 
  open, 
  onOpenChange, 
  user, 
  currentUserRole 
}: AdminProfileEditDialogProps) {
  const updateProfile = useProfileUpdate();

  const handleSave = async (userId: string, updates: Partial<UserProfile>) => {
    await updateProfile.mutateAsync({ userId, updates });
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User Profile</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <ProfileEditForm
            user={user}
            currentUserRole={currentUserRole}
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={updateProfile.isPending}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
