
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserProfile } from '@/types/userTypes';

interface MemberDetailViewProps {
  member: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MemberDetailView: React.FC<MemberDetailViewProps> = ({
  member,
  isOpen,
  onClose
}) => {
  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Member Details: {member.display_name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Display Name</label>
              <p className="text-sm text-muted-foreground">{member.display_name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-sm text-muted-foreground">{member.email || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Credits</label>
              <p className="text-sm text-muted-foreground">{member.credits}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Country</label>
              <p className="text-sm text-muted-foreground">{member.country || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Created At</label>
              <p className="text-sm text-muted-foreground">
                {new Date(member.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          {member.bio && (
            <div>
              <label className="text-sm font-medium">Bio</label>
              <p className="text-sm text-muted-foreground">{member.bio}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
