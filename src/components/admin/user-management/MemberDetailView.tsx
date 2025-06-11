
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { UserProfile, UserRole } from '@/types/userTypes';

interface MemberDetailViewProps {
  member: UserProfile | null;
  onBack: () => void;
  onRoleChange: (userId: string, newRole: UserRole) => Promise<void>;
}

export const MemberDetailView: React.FC<MemberDetailViewProps> = ({
  member,
  onBack,
  onRoleChange
}) => {
  if (!member) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
        <h2 className="text-2xl font-bold">Member Details</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{member.display_name || 'Unnamed User'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>
    </div>
  );
};
