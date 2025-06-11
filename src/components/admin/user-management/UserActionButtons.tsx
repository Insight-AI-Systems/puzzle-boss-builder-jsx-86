
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, UserCog, Download } from 'lucide-react';

interface UserActionButtonsProps {
  selectedUsers: Set<string>;
  onEmailClick: () => void;
  onRoleClick: () => void;
  onExportClick: () => void;
}

export const UserActionButtons: React.FC<UserActionButtonsProps> = ({
  selectedUsers,
  onEmailClick,
  onRoleClick,
  onExportClick
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
      <Button
        variant="outline"
        size="sm"
        onClick={onExportClick}
      >
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
    </div>
  );
};
