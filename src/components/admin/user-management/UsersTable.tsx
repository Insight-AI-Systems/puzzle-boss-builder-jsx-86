
import React from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { UserTableHeader } from './UserTableHeader';
import { UserTableRow } from './UserTableRow';
import { UserTableProps } from '@/types/userTableTypes';
import { UserRole } from '@/types/userTypes';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, Database, UserSearch, Shield } from 'lucide-react';
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
  
  const isSuperAdmin = currentUserRole === 'super_admin';
  const isCurrentUserProtectedAdmin = isProtectedAdmin(currentUserEmail);
  const canAssignAnyRole = isSuperAdmin || isCurrentUserProtectedAdmin;
  
  const canAssignRole = (role: UserRole, userId: string): boolean => {
    if (canAssignAnyRole) return true;
    if (isProtectedAdmin(userId)) return isCurrentUserProtectedAdmin;
    if (currentUserRole === 'super_admin' && role !== 'super_admin') return true;
    return false;
  };

  // Group users by type (admin vs regular)
  const adminUsers = users.filter(user => 
    ['super_admin', 'admin', 'category_manager', 'social_media_manager', 'partner_manager', 'cfo'].includes(user.role)
  );
  
  const regularUsers = users.filter(user => 
    user.role === 'player'
  );

  // Determine which user group to display based on empty arrays
  const displayAdminUsers = adminUsers.length > 0;
  const displayRegularUsers = regularUsers.length > 0;
  const displayNoUsers = adminUsers.length === 0 && regularUsers.length === 0;

  return (
    <div>
      {/* If we have admin users, show them in a table with a header */}
      {displayAdminUsers && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center text-amber-500">
            <Shield className="h-5 w-5 mr-2" />
            Admin & Management Users
          </h3>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <UserTableHeader
                selectionEnabled={selectionEnabled}
                onSelectAll={onSelectAll ? 
                  (checked) => onSelectAll(checked) : 
                  undefined
                }
                onSortByRole={onSortByRole}
                onSortByLastLogin={onSortByLastLogin || (() => {})}
                lastLoginSortDirection={lastLoginSortDirection}
                showAccountStatus={true}
              />
              <TableBody>
                {adminUsers.map(user => (
                  <UserTableRow
                    key={user.id}
                    user={user}
                    canAssignRole={canAssignRole}
                    onRoleChange={onRoleChange}
                    isSelected={selectedUsers.has(user.id)}
                    onSelect={onUserSelection ? (checked) => onUserSelection(user.id, checked) : undefined}
                    selectionEnabled={selectionEnabled}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* If we have regular users, show them in a table with a header */}
      {displayRegularUsers && (
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center text-blue-500">
            <UserSearch className="h-5 w-5 mr-2" />
            Regular Users
          </h3>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <UserTableHeader
                selectionEnabled={selectionEnabled}
                onSelectAll={onSelectAll ? 
                  (checked) => onSelectAll(checked) : 
                  undefined
                }
                onSortByRole={onSortByRole}
                onSortByLastLogin={onSortByLastLogin || (() => {})}
                lastLoginSortDirection={lastLoginSortDirection}
                showAccountStatus={true}
              />
              <TableBody>
                {regularUsers.map(user => (
                  <UserTableRow
                    key={user.id}
                    user={user}
                    canAssignRole={canAssignRole}
                    onRoleChange={onRoleChange}
                    isSelected={selectedUsers.has(user.id)}
                    onSelect={onUserSelection ? (checked) => onUserSelection(user.id, checked) : undefined}
                    selectionEnabled={selectionEnabled}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* If we have no users, show an error message */}
      {displayNoUsers && (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <UserTableHeader
              selectionEnabled={selectionEnabled}
              onSelectAll={onSelectAll ? 
                (checked) => onSelectAll(checked) : 
                undefined
              }
              onSortByRole={onSortByRole}
              onSortByLastLogin={onSortByLastLogin || (() => {})}
              lastLoginSortDirection={lastLoginSortDirection}
              showAccountStatus={true}
            />
            <TableBody>
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
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
