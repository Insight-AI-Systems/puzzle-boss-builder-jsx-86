
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
}

export function UsersTable({ 
  users, 
  currentUserRole, 
  onRoleChange,
}: UsersTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6">
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
