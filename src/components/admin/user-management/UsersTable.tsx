
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserProfile, UserRole, ROLE_DEFINITIONS } from '@/types/userTypes';
import { UserAvatar } from './UserAvatar';
import { RoleSelector } from './RoleSelector';
import { SortAsc, SortDesc } from "lucide-react";

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
  const getSortIcon = (columnName: string) => {
    if (sortConfig.key !== columnName) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? 
      <SortAsc className="h-4 w-4 inline ml-1" /> : 
      <SortDesc className="h-4 w-4 inline ml-1" />;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => onRequestSort('display_name')} className="cursor-pointer">
              User {getSortIcon('display_name')}
            </TableHead>
            <TableHead onClick={() => onRequestSort('role')} className="cursor-pointer">
              Role {getSortIcon('role')}
            </TableHead>
            <TableHead onClick={() => onRequestSort('credits')} className="cursor-pointer">
              Credits {getSortIcon('credits')}
            </TableHead>
            <TableHead onClick={() => onRequestSort('created_at')} className="cursor-pointer">
              Joined {getSortIcon('created_at')}
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
