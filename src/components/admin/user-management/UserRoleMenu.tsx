
import React from 'react';
import { Button } from "@/components/ui/button";
import { Shield, ChevronDown } from "lucide-react";
import { ROLE_DEFINITIONS } from '@/types/userTypes';
import { UserRoleMenuProps } from '@/types/userTableTypes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export const UserRoleMenu: React.FC<UserRoleMenuProps> = ({
  user,
  canAssignRole,
  onRoleChange
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Shield className="h-4 w-4" />
          Change Role
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.values(ROLE_DEFINITIONS).map((roleDef) => {
          // Store the result of canAssignRole in a variable to avoid calling it multiple times
          const canAssign = canAssignRole(roleDef.role, user.id);
          const isCurrentRole = user.role === roleDef.role;
          
          return (
            <DropdownMenuItem
              key={roleDef.role}
              onClick={() => {
                if (canAssign && !isCurrentRole) {
                  onRoleChange(user.id, roleDef.role);
                }
              }}
              disabled={!canAssign || isCurrentRole}
            >
              {roleDef.label}
              {isCurrentRole && " (current)"}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
