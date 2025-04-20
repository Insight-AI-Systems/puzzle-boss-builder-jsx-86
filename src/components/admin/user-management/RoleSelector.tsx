
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown, Shield } from "lucide-react";
import { UserRole, ROLE_DEFINITIONS } from '@/types/userTypes';

interface RoleSelectorProps {
  currentRole: UserRole;
  currentUserRole: UserRole;
  userId: string;
  onRoleChange: (userId: string, newRole: UserRole) => void;
}

export function RoleSelector({ 
  currentRole, 
  currentUserRole, 
  userId, 
  onRoleChange 
}: RoleSelectorProps) {
  // Helper function to determine if current user can assign a role
  const canAssignRole = (role: UserRole): boolean => {
    if (currentUserRole === 'super_admin') return true;
    if (currentUserRole === 'admin' && role !== 'super_admin' && role !== 'admin') return true;
    return false;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
        >
          <Shield className="h-4 w-4" />
          <span className="hidden md:inline">Change Role</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.values(ROLE_DEFINITIONS).map((roleDef) => (
          <DropdownMenuItem
            key={roleDef.role}
            onClick={() => onRoleChange(userId, roleDef.role)}
            disabled={
              !canAssignRole(roleDef.role) || 
              currentRole === roleDef.role ||
              (currentUserRole !== 'super_admin' && userId === 'own-user-id') // Can't change own role unless super_admin
            }
            className="flex items-center justify-between"
          >
            <span>{roleDef.label}</span>
            {currentRole === roleDef.role && (
              <Check className="h-4 w-4 text-green-600" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
