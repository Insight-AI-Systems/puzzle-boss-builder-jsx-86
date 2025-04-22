
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ROLE_DEFINITIONS, UserProfile, UserRole } from '@/types/userTypes';
import { Shield, ChevronDown } from "lucide-react";

interface RoleDropdownMenuProps {
  user: UserProfile;
  canAssignRole: (role: UserRole, userId: string) => boolean;
  onRoleChange: (userId: string, newRole: UserRole) => void;
}

export function RoleDropdownMenu({
  user,
  canAssignRole,
  onRoleChange,
}: RoleDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Shield className="h-4 w-4 mr-1" />
          Change Role
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Assign Role</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.values(ROLE_DEFINITIONS).map((roleInfo) => {
          const canAssign = canAssignRole(roleInfo.role, user.id);
          const isCurrentRole = user.role === roleInfo.role;
          return (
            <DropdownMenuItem
              key={roleInfo.role}
              onClick={() => onRoleChange(user.id, roleInfo.role)}
              disabled={!canAssign || isCurrentRole}
              className={isCurrentRole ? 'bg-muted font-medium' : ''}
            >
              {roleInfo.label}
              {isCurrentRole && " (current)"}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
