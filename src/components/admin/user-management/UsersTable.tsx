
import React from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { UserTableHeader } from './UserTableHeader';
import { UserTableRow } from './UserTableRow';
import { UserTableProps } from '@/types/userTableTypes';
import { UserRole } from '@/types/userTypes';

// Updated to use the correct admin email
const PROTECTED_ADMIN_EMAIL = 'alantbooth@xtra.co.nz';

export function UsersTable({ 
  users, 
  currentUserRole, 
  currentUserEmail,
  onRoleChange,
  onSortByRole,
  selectedUsers = new Set(),
  onUserSelection,
  onSelectAll
}: UserTableProps) {
  const selectionEnabled = !!onUserSelection && !!onSelectAll;
  
  // Fix the type comparison by using type assertion or checking equality
  const isSuperAdmin = currentUserRole === 'super_admin' as UserRole;
  const isCurrentUserProtectedAdmin = currentUserEmail === PROTECTED_ADMIN_EMAIL;
  const canAssignAnyRole = isSuperAdmin || isCurrentUserProtectedAdmin;
  
  const canAssignRole = (role: UserRole, userId: string): boolean => {
    if (canAssignAnyRole) return true;
    if (userId === PROTECTED_ADMIN_EMAIL) return isCurrentUserProtectedAdmin;
    if (currentUserRole === 'super_admin' as UserRole && role !== 'super_admin' as UserRole) return true;
    return false;
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <UserTableHeader
          selectionEnabled={selectionEnabled}
          onSelectAll={onSelectAll}
          onSortByRole={onSortByRole}
        />
        <TableBody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={selectionEnabled ? 7 : 6} className="text-center py-6">
                No users found matching your search.
              </td>
            </tr>
          ) : (
            users.map(user => (
              <UserTableRow
                key={user.id}
                user={user}
                canAssignRole={canAssignRole}
                onRoleChange={onRoleChange}
                isSelected={selectedUsers.has(user.id)}
                onSelect={(checked) => onUserSelection?.(user.id, checked)}
                selectionEnabled={selectionEnabled}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
