
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserProfile, UserRole, ROLE_DEFINITIONS } from '@/types/userTypes';
import { UserAvatar } from './UserAvatar';
import { RoleSelector } from './RoleSelector';

interface UsersTableProps {
  users: UserProfile[];
  currentUserRole: UserRole;
  onRoleChange: (userId: string, newRole: UserRole) => void;
  sortConfig: { key: string; direction: 'ascending' | 'descending' };
  onRequestSort: (key: string) => void;
}

export function UsersTable({ 
  users, 
  currentUserRole, 
  onRoleChange, 
  sortConfig, 
  onRequestSort 
}: UsersTableProps) {
  // Helper to render sort indicator
  const renderSortIndicator = (columnKey: string) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onRequestSort('display_name')}
            >
              User {renderSortIndicator('display_name')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onRequestSort('role')}
            >
              Role {renderSortIndicator('role')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onRequestSort('credits')}
            >
              Credits {renderSortIndicator('credits')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onRequestSort('created_at')}
            >
              Joined {renderSortIndicator('created_at')}
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6">
                No users found matching your search.
              </TableCell>
            </TableRow>
          ) : (
            users.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <UserAvatar 
                    avatarUrl={user.avatar_url} 
                    displayName={user.display_name} 
                    userId={user.id} 
                  />
                </TableCell>
                <TableCell>
                  <Badge 
                    className={
                      user.role === 'super_admin' ? 'bg-red-600' :
                      user.role === 'admin' ? 'bg-purple-600' :
                      user.role === 'category_manager' ? 'bg-blue-600' :
                      user.role === 'social_media_manager' ? 'bg-green-600' :
                      user.role === 'partner_manager' ? 'bg-amber-600' :
                      user.role === 'cfo' ? 'bg-emerald-600' :
                      'bg-slate-600'
                    }
                  >
                    {ROLE_DEFINITIONS[user.role]?.label || user.role}
                  </Badge>
                </TableCell>
                <TableCell>{user.credits || 0}</TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <RoleSelector 
                    currentRole={user.role} 
                    currentUserRole={currentUserRole} 
                    userId={user.id}
                    onRoleChange={onRoleChange}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
