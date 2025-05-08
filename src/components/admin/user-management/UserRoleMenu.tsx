
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Shield, ChevronDown, Info } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { ROLE_DEFINITIONS, UserRole } from '@/types/userTypes';
import { UserRoleMenuProps } from '@/types/userTableTypes';
import { isProtectedAdmin } from '@/utils/constants';
import { debugLog, DebugLevel } from '@/utils/debug';
import { adminService } from '@/services/adminService';
import { roleService } from '@/services/roleService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from '@/hooks/use-toast';

// Helper function to replace all occurrences in a string (for ES2020 and below compatibility)
const safeReplaceAll = (str: string, find: string, replace: string): string => {
  return str.split(find).join(replace);
};

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
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [roleToChangeTo, setRoleToChangeTo] = useState<UserRole | null>(null);
  
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
  
  // Function to handle role change with confirmation
  const handleRoleChangeClick = (newRole: UserRole) => {
    setRoleToChangeTo(newRole);
    setConfirmationOpen(true);
  };
  
  // Function to confirm and execute role change
  const confirmRoleChange = async () => {
    if (!roleToChangeTo) return;
    
    try {
      debugLog('UserRoleMenu', `Confirming role change for user ${user.id} to ${roleToChangeTo}`, DebugLevel.INFO);
      
      // Use the onRoleChange callback (for backward compatibility)
      onRoleChange(user.id, roleToChangeTo);
      
      // Close dialog
      setConfirmationOpen(false);
      setRoleToChangeTo(null);
      
      // Show success toast
      toast({
        title: "Role updated",
        description: `User's role has been updated to ${ROLE_DEFINITIONS[roleToChangeTo]?.label || roleToChangeTo}`
      });
      
    } catch (error) {
      debugLog('UserRoleMenu', `Error changing role: ${error}`, DebugLevel.ERROR);
      
      // Close dialog
      setConfirmationOpen(false);
      setRoleToChangeTo(null);
      
      // Show error toast
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
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            {user.role === 'player' ? 'Assign Role' : 'Change Role'}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
            Current role: {ROLE_DEFINITIONS[user.role]?.label || user.role}
          </div>
          <DropdownMenuSeparator />
          {Object.values(ROLE_DEFINITIONS).map((roleDef) => {
            // Store the result of canAssignRole in a variable to avoid calling it multiple times
            const canAssign = canAssignRole(roleDef.role, user.id);
            const isCurrentRole = user.role === roleDef.role;
            
            return (
              <DropdownMenuItem
                key={roleDef.role}
                onClick={() => {
                  if (canAssign && !isCurrentRole) {
                    handleRoleChangeClick(roleDef.role);
                  }
                }}
                disabled={!canAssign || isCurrentRole}
                className={`flex justify-between items-center ${isCurrentRole ? "bg-muted/50 font-medium" : ""}`}
              >
                <span>{roleDef.label}</span>
                {isCurrentRole && <span className="text-xs">(current)</span>}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 ml-2 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs">
                      <p className="font-medium text-sm mb-1">{roleDef.label}</p>
                      <p className="text-xs">{roleDef.description}</p>
                      <div className="mt-2">
                        <p className="text-xs font-medium mb-1">Permissions:</p>
                        <ul className="text-xs list-disc pl-4">
                          {roleDef.permissions.slice(0, 5).map(perm => (
                            <li key={perm}>{safeReplaceAll(perm, '_', ' ')}</li>
                          ))}
                          {roleDef.permissions.length > 5 && (
                            <li>+{roleDef.permissions.length - 5} more...</li>
                          )}
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Role Change Confirmation Dialog */}
      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Role Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to change this user's role from 
              <span className="font-medium"> {ROLE_DEFINITIONS[user.role]?.label || user.role}</span> to
              <span className="font-medium"> {roleToChangeTo ? ROLE_DEFINITIONS[roleToChangeTo]?.label || roleToChangeTo : ''}?</span>
            </DialogDescription>
          </DialogHeader>
          
          {roleToChangeTo && (
            <div className="py-4">
              <h4 className="text-sm font-medium mb-2">
                About the {ROLE_DEFINITIONS[roleToChangeTo]?.label || roleToChangeTo} role:
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                {ROLE_DEFINITIONS[roleToChangeTo]?.description}
              </p>
              
              <h4 className="text-sm font-medium mb-2">Permissions:</h4>
              <div className="grid grid-cols-2 gap-2">
                {ROLE_DEFINITIONS[roleToChangeTo]?.permissions.map(permission => (
                  <div key={permission} className="text-xs py-1 px-2 bg-muted/30 rounded-sm">
                    {safeReplaceAll(permission, '_', ' ')}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmationOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmRoleChange}
              variant={roleToChangeTo === 'super_admin' ? 'destructive' : 'default'}
            >
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
