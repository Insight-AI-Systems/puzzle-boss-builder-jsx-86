
import React from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { UserTableHeader } from './UserTableHeader';
import { UserTableRow } from './UserTableRow';
import { UserTableProps } from '@/types/userTableTypes';
import { UserRole } from '@/types/userTypes';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const PROTECTED_ADMIN_EMAIL = 'alan@insight-ai-systems.com';

export function UsersTable({ 
  users, 
  currentUserRole, 
  currentUserEmail,
  onRoleChange,
  onSortByRole,
  onSortByLastLogin,
  selectedUsers = new Set(),
  onUserSelection,
  onSelectAll,
  lastLoginSortDirection,
  onRefresh
}: UserTableProps & { onRefresh?: () => void }) {
  const selectionEnabled = !!onUserSelection && !!onSelectAll;
  
  // Fix the type comparison by using type assertion
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
          onSortByLastLogin={() => onSortByLastLogin?.(lastLoginSortDirection === 'asc' ? 'desc' : 'asc')}
          lastLoginSortDirection={lastLoginSortDirection}
        />
        <TableBody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={selectionEnabled ? 8 : 7} className="text-center py-6">
                <div className="flex flex-col items-center justify-center space-y-4 p-4">
                  <p className="text-muted-foreground">
                    No users found matching your search.
                  </p>
                  {onRefresh && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={onRefresh}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Refresh User List
                    </Button>
                  )}
                </div>
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
