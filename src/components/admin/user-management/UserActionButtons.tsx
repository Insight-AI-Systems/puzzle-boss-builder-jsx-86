
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, UserCog } from 'lucide-react';

interface UserActionButtonsProps {
  selectedUsers: Set<string>;
  onEmailClick: () => void;
  onRoleClick: () => void;
}

export const UserActionButtons: React.FC<UserActionButtonsProps> = ({
  selectedUsers,
  onEmailClick,
  onRoleClick
}) => {
  const hasSelectedUsers = selectedUsers.size > 0;

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onEmailClick}
        disabled={!hasSelectedUsers}
      >
        <Mail className="h-4 w-4 mr-2" />
        Email ({selectedUsers.size})
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onRoleClick}
        disabled={!hasSelectedUsers}
      >
        <UserCog className="h-4 w-4 mr-2" />
        Change Role ({selectedUsers.size})
      </Button>
    </div>
  );
};
