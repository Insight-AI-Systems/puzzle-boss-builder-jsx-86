
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

const PROTECTED_ADMIN_EMAIL = 'alan@insight-ai-systems.com';

// Helper: returns true if given userId (here, email) matches protected admin
function isProtectedAdminId(id: string | undefined): boolean {
  return id === PROTECTED_ADMIN_EMAIL;
}

interface RoleSelectorProps {
  currentRole: UserRole;
  currentUserRole?: UserRole;
  userId?: string; // this is the target user's "id"
  onRoleChange: (userId: string | undefined, newRole: string) => void;
  label?: string;
  currentUserEmail?: string; // user's email for permission logic
}

export function RoleSelector({ 
  currentRole = 'player', 
  currentUserRole = 'admin', 
  userId, 
  onRoleChange,
  label,
  currentUserEmail
}: RoleSelectorProps) {
  // "Super admin" status
  const isSuperAdmin = currentUserRole === 'super_admin';
  const isCurrentUserProtectedAdmin = isProtectedAdminId(currentUserEmail);
  // The person viewing may be a super admin or protected admin
  const canAssignAnyRole = isSuperAdmin || isCurrentUserProtectedAdmin;

  // Helper: Only super admin or specific protected admin can assign 'super_admin'
  const canAssignRole = (targetRole: UserRole): boolean => {
    if (canAssignAnyRole) return true;
    if (currentUserRole === 'admin' && targetRole !== 'super_admin') return true;
    return false;
  };

  // For diagnostic log
  console.log('RoleSelector Debug:', {
    currentRole,
    currentUserRole,
    userId,
    currentUserEmail,
    isSuperAdmin,
    isCurrentUserProtectedAdmin,
    canAssignAnyRole,
    availableRoles: Object.keys(ROLE_DEFINITIONS),
  });

  // Disallow changing own role
  const isOwnUser = userId === currentUserEmail;

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
            
            console.log(`RoleSelector - Role option: ${roleDef.role}, canAssign: ${canAssign}, isSameRole: ${isSameRole}`);
            
            return (
              <DropdownMenuItem
                key={roleDef.role}
                onClick={() => {
                  if (canAssign && !isSameRole && !isOwnUser) {
                    onRoleChange(userId, roleDef.role);
                  }
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
