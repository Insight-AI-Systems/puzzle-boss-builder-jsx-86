
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRole, ROLE_DEFINITIONS } from '@/types/userTypes';

interface RoleSelectorProps {
  currentRole: UserRole;
  currentUserRole: UserRole;
  userId: string;
  onRoleChange: (userId: string, newRole: UserRole) => void;
}

export function RoleSelector({ currentRole, currentUserRole, userId, onRoleChange }: RoleSelectorProps) {
  const canAssignRole = (role: UserRole): boolean => {
    return ROLE_DEFINITIONS[role].canBeAssignedBy.includes(currentUserRole);
  };

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
        {Object.values(ROLE_DEFINITIONS).map((roleInfo) => (
          <DropdownMenuItem
            key={roleInfo.role}
            onClick={() => onRoleChange(userId, roleInfo.role)}
            disabled={!canAssignRole(roleInfo.role) || currentRole === roleInfo.role}
            className={currentRole === roleInfo.role ? 'bg-muted font-medium' : ''}
          >
            <Badge 
              variant="outline" 
              className={`mr-2 ${
                roleInfo.role === 'super_admin' ? 'border-red-600' :
                roleInfo.role === 'admin' ? 'border-purple-600' :
                roleInfo.role === 'category_manager' ? 'border-blue-600' :
                roleInfo.role === 'social_media_manager' ? 'border-green-600' :
                roleInfo.role === 'partner_manager' ? 'border-amber-600' :
                roleInfo.role === 'cfo' ? 'border-emerald-600' :
                'border-slate-600'
              }`}
            >
              {roleInfo.label}
            </Badge>
            {currentRole === roleInfo.role && " (current)"}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
