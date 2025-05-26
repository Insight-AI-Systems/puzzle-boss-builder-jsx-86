
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserProfile, UserRole, ROLE_DEFINITIONS } from '@/types/userTypes';

interface RoleUserTableProps {
  profiles: UserProfile[];
  currentUserRole: UserRole;
  currentUserEmail?: string;
  handleRoleChange: (userId: string, newRole: UserRole) => void;
  canAssignRole: (role: UserRole, userId: string) => boolean;
}

export function RoleUserTable({
  profiles,
  currentUserRole,
  currentUserEmail,
  handleRoleChange,
  canAssignRole
}: RoleUserTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Current Role</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {profiles.map((profile) => (
          <TableRow key={profile.id}>
            <TableCell>{profile.display_name || 'Anonymous User'}</TableCell>
            <TableCell>{profile.email}</TableCell>
            <TableCell>
              <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                {profile.role || 'player'}
              </span>
            </TableCell>
            <TableCell>
              <Select
                value={profile.role || 'player'}
                onValueChange={(newRole) => handleRoleChange(profile.id, newRole as UserRole)}
                disabled={!canAssignRole(profile.role || 'player', profile.id)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ROLE_DEFINITIONS).map(([role, definition]) => (
                    <SelectItem key={role} value={role}>
                      {definition.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
