
import React from 'react';
import { Button } from "@/components/ui/button";
import { Shield, ChevronDown } from "lucide-react";
import { ROLE_DEFINITIONS, UserRole } from '@/types/userTypes';
import { UserRoleMenuProps } from '@/types/userTableTypes';
import { isProtectedAdmin } from '@/constants/securityConfig';
import { debugLog, DebugLevel } from '@/utils/debug';
import { adminService } from '@/services/adminService';
import { roleService } from '@/services/roleService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

/**
 * User Role Menu Component
 * 
 * Dropdown menu for changing user roles in the admin panel
 * Special handling for protected admin users whose role cannot be changed
 * 
 * @param props - Component props
 * @returns Role selection dropdown component
 */
export const UserRoleMenu: React.FC<UserRoleMenuProps> = ({
  user,
  canAssignRole,
  onRoleChange
}) => {
  const { toast } = useToast();
  // Check if this is the protected admin user
  const isProtectedAdminUser = adminService.isProtectedAdminEmail(user.email);
  
  // Log the role menu rendering for debugging
  React.useEffect(() => {
    debugLog('UserRoleMenu', `Rendering role menu for user: ${user.id}`, DebugLevel.INFO, {
      userId: user.id,
      email: user.email,
      currentRole: user.role,
      isProtectedAdmin: isProtectedAdminUser
    });
  }, [user.id, user.email, user.role, isProtectedAdminUser]);
  
  // Function to handle role change with logging
  const handleRoleChange = async (newRole: UserRole) => {
    try {
      debugLog('UserRoleMenu', `Changing role for user ${user.id} to ${newRole}`, DebugLevel.INFO);
      
      // Use the onRoleChange callback (for backward compatibility)
      onRoleChange(user.id, newRole);
      
    } catch (error) {
      debugLog('UserRoleMenu', `Error changing role: ${error}`, DebugLevel.ERROR);
      toast({
        title: "Error changing role",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  };

  // If this is the protected admin, disable role changes completely
  if (isProtectedAdminUser) {
    return (
      <Button variant="outline" size="sm" className="flex items-center gap-1" disabled title="Role changes not allowed for protected admin">
        <Shield className="h-4 w-4" />
        Protected Admin
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Shield className="h-4 w-4" />
          {user.role === 'player' ? 'Assign Role' : 'Change Role'}
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
                  handleRoleChange(roleDef.role);
                }
              }}
              disabled={!canAssign || isCurrentRole}
              className={isCurrentRole ? "bg-muted/50 font-medium" : ""}
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
