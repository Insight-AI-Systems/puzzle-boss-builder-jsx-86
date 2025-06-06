
import React from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { UserTableHeader } from './UserTableHeader';
import { UserTableRow } from './UserTableRow';
import { UserTableProps } from '@/types/userTableTypes';
import { UserRole } from '@/types/userTypes';

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
  
  // Check if current user has admin privileges based on role
  const isSuperAdmin = currentUserRole === 'super_admin' as UserRole;
  const isAdmin = currentUserRole === 'admin' as UserRole;
  const canAssignAnyRole = isSuperAdmin;
  
  const canAssignRole = (role: UserRole, userId: string): boolean => {
    // Super admins can assign any role
    if (isSuperAdmin) return true;
    
    // Regular admins can assign roles except super_admin
    if (isAdmin && role !== 'super_admin' as UserRole) return true;
    
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
              <td colSpan={selectionEnabled ? 6 : 5} className="text-center py-6">
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
