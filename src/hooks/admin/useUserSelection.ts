
import { useState } from 'react';
import { UserProfile } from '@/types/userTypes';

export function useUserSelection() {
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  const handleUserSelection = (userId: string, isSelected: boolean) => {
    const newSelection = new Set(selectedUsers);
    if (isSelected) {
      newSelection.add(userId);
    } else {
      newSelection.delete(userId);
    }
    setSelectedUsers(newSelection);
  };

  const handleSelectAllUsers = (isSelected: boolean, users?: UserProfile[]) => {
    if (isSelected && users) {
      const allUserIds = users.map(user => user.id);
      setSelectedUsers(new Set(allUserIds));
    } else {
      setSelectedUsers(new Set());
    }
  };

  return {
    selectedUsers,
    setSelectedUsers,
    handleUserSelection,
    handleSelectAllUsers
  };
}
