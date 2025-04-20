
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
  // Helper function to determine if current user can assign a role
  const canAssignRole = (role: UserRole): boolean => {
    // Special case for protected admin email
    const isProtectedAdmin = userId === 'alan@insight-ai-systems.com';
    
    // Log the permission check for debugging
    console.log(`RoleSelector - Permission check: role=${role}, currentUserRole=${currentUserRole}, isProtectedAdmin=${isProtectedAdmin}`);
    
    // Super admins can assign any role
    if (currentUserRole === 'super_admin') {
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
          {Object.values(ROLE_DEFINITIONS).map((roleDef) => (
            <DropdownMenuItem
              key={roleDef.role}
              onClick={() => {
                console.log(`RoleSelector - Selected role: ${roleDef.role}`);
                onRoleChange(userId, roleDef.role);
              }}
              disabled={
                !canAssignRole(roleDef.role) || 
                currentRole === roleDef.role ||
                (userId === 'own-user-id') // Can't change own role
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
    </div>
  );
}
