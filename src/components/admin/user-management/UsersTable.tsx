
import React from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { UserTableHeader } from './UserTableHeader';
import { UserTableRow } from './UserTableRow';
import { UserTableProps } from '@/types/userTableTypes';
import { UserRole } from '@/types/userTypes';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, Database } from 'lucide-react';
import { isProtectedAdmin } from '@/utils/constants';

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
}: UserTableProps) {
  const selectionEnabled = !!onUserSelection && !!onSelectAll;
  
  // Fix the type comparison by using type assertion
  const isSuperAdmin = currentUserRole === 'super_admin' as UserRole;
  const isCurrentUserProtectedAdmin = isProtectedAdmin(currentUserEmail);
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
          onSortByLastLogin={() => onSortByLastLogin?.()}
          lastLoginSortDirection={lastLoginSortDirection}
        />
        <TableBody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={selectionEnabled ? 8 : 7} className="text-center py-6">
                <div className="flex flex-col items-center justify-center space-y-4 p-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Database className="h-5 w-5" />
                    <p>
                      No users found. There may be an issue with database connectivity or permissions.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
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
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => {
                        if (isCurrentUserProtectedAdmin) {
                          alert("Protected admin detected. Please check database configuration and logs.");
                        } else {
                          alert("Please check with your administrator about database permissions.");
                        }
                      }}
                      className="flex items-center gap-2"
                    >
                      <AlertCircle className="h-4 w-4" />
                      Database Info
                    </Button>
                  </div>
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

const PROTECTED_ADMIN_EMAIL = 'alan@insight-ai-systems.com';
