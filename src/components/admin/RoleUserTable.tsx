
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Shield, ChevronDown } from "lucide-react";
import { ROLE_DEFINITIONS, UserProfile, UserRole } from '@/types/userTypes';
import { RoleDropdownMenu } from './RoleDropdownMenu';

// Updated to use the correct admin email
const PROTECTED_ADMIN_EMAIL = 'alantbooth@xtra.co.nz';

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
  canAssignRole,
}: RoleUserTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {user.display_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="font-medium">{user.display_name || 'Anonymous User'}</div>
                    <div className="text-xs text-muted-foreground">{user.id.substring(0, 8)}...</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    user.role === 'super_admin'
                      ? 'bg-red-600'
                      : user.role === 'category_manager'
                      ? 'bg-blue-600'
                      : user.role === 'social_media_manager'
                      ? 'bg-green-600'
                      : user.role === 'partner_manager'
                      ? 'bg-amber-600'
                      : user.role === 'cfo'
                      ? 'bg-emerald-600'
                      : 'bg-slate-600'
                  }
                >
                  {ROLE_DEFINITIONS[user.role]?.label || user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {ROLE_DEFINITIONS[user.role]?.permissions.slice(0, 3).map((perm) => (
                    <Badge key={perm} variant="outline" className="text-xs">
                      {perm}
                    </Badge>
                  ))}
                  {ROLE_DEFINITIONS[user.role]?.permissions.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{ROLE_DEFINITIONS[user.role].permissions.length - 3} more
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <RoleDropdownMenu
                  user={user}
                  canAssignRole={canAssignRole}
                  onRoleChange={handleRoleChange}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
