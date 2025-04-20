
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
import { Label } from '@/components/ui/label';

interface RoleSelectorProps {
  currentRole: UserRole;
  currentUserRole?: UserRole;
  userId?: string;
  onRoleChange: (userId: string | undefined, newRole: string) => void;
  label?: string;
}

export function RoleSelector({ 
  currentRole = 'player', 
  currentUserRole = 'admin', 
  userId, 
  onRoleChange,
  label
}: RoleSelectorProps) {
  const isSuperAdmin = currentUserRole === 'super_admin';
  // Special case for protected admin email
  const isProtectedAdmin = userId === 'alan@insight-ai-systems.com';
  
  // Helper function to determine if current user can assign a role
  const canAssignRole = (role: UserRole): boolean => {
    // Log the parameters for debugging
    console.log(`RoleSelector - Checking if can assign ${role}. currentUserRole=${currentUserRole}, isSuperAdmin=${isSuperAdmin}, isProtectedAdmin=${isProtectedAdmin}`);
    
    // Super admins can assign any role
    if (isSuperAdmin) {
      console.log('RoleSelector - User is super_admin, can assign any role');
      return true;
    }
    
    // Special protected admin can assign any role to themselves
    if (isProtectedAdmin && userId === 'alan@insight-ai-systems.com') {
      console.log('RoleSelector - Protected admin can manage their own role');
      return true;
    }
    
    // Admins can assign most roles except super_admin
    if (currentUserRole === 'admin' && role !== 'super_admin') {
      console.log('RoleSelector - User is admin, can assign non-super_admin roles');
      return true;
    }
    
    // Other roles cannot assign roles
    console.log('RoleSelector - User cannot assign this role');
    return false;
  };

  // Cannot change own role (except for protected admin)
  const isOwnUser = userId === 'own-user-id';

  return (
    <div className="space-y-2">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 w-full justify-between"
          >
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span>{ROLE_DEFINITIONS[currentRole]?.label || 'Select Role'}</span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {Object.values(ROLE_DEFINITIONS).map((roleDef) => {
            const canAssign = canAssignRole(roleDef.role);
            const isSameRole = currentRole === roleDef.role;
            
            console.log(`RoleSelector - Role ${roleDef.role}: canAssign=${canAssign}, isSameRole=${isSameRole}`);
            
            return (
              <DropdownMenuItem
                key={roleDef.role}
                onClick={() => {
                  console.log(`RoleSelector - Selected role: ${roleDef.role}`);
                  onRoleChange(userId, roleDef.role);
                }}
                disabled={!canAssign || isSameRole || isOwnUser}
                className="flex items-center justify-between"
              >
                <span>{roleDef.label}</span>
                {isSameRole && (
                  <Check className="h-4 w-4 text-green-600" />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
