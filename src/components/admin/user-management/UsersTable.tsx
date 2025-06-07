
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserTableRow, ExtendedUserRowProps } from './UserTableRow';
import { UserTableProps } from '@/types/userTableTypes';
import { UserProfile } from '@/types/userTypes';

interface ExtendedUserTableProps extends UserTableProps {
  onEditProfile?: (user: UserProfile) => void;
}

export const UsersTable: React.FC<ExtendedUserTableProps> = ({
  users,
  currentUserRole,
  currentUserEmail,
  onRoleChange,
  onSortByRole,
  selectedUsers,
  onUserSelection,
  onSelectAll,
  onEditProfile
}) => {
  const canAssignRole = (role: string, userId: string) => {
    if (currentUserRole === 'super_admin') return true;
    if (currentUserRole === 'admin' && role !== 'super_admin') return true;
    return false;
  };

  const handleUserSelection = (userId: string, isSelected: boolean) => {
    onUserSelection?.(userId, isSelected);
  };

  const handleSelectAll = (isSelected: boolean) => {
    onSelectAll?.(isSelected);
  };

  const selectionEnabled = !!selectedUsers && !!onUserSelection;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {selectionEnabled && (
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={users.length > 0 && users.every(user => selectedUsers?.has(user.id))}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300"
                />
              </TableHead>
            )}
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead onClick={onSortByRole} className="cursor-pointer hover:bg-muted/50">
              Role
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              canAssignRole={(role: string) => canAssignRole(role, user.id)}
              onRoleChange={onRoleChange}
              isSelected={selectedUsers?.has(user.id)}
              onSelect={(isSelected) => handleUserSelection(user.id, isSelected)}
              selectionEnabled={selectionEnabled}
              onEditProfile={onEditProfile}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
