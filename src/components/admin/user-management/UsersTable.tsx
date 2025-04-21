import React, { useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, Shield, ChevronDown } from "lucide-react";
import { UserProfile, UserRole, ROLE_DEFINITIONS } from '@/types/userTypes';
import { UserAvatar } from './UserAvatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface UsersTableProps {
  users: UserProfile[];
  currentUserRole: UserRole;
  onRoleChange: (userId: string, newRole: UserRole) => void;
  onSortByRole: () => void;
  selectedUsers?: Set<string>;
  onUserSelection?: (userId: string, isSelected: boolean) => void;
  onSelectAll?: (isSelected: boolean) => void;
}

const PROTECTED_ADMIN_EMAIL = 'alan@insight-ai-systems.com';
function isProtectedAdminId(id?: string) {
  return id === PROTECTED_ADMIN_EMAIL;
}

export function UsersTable({ 
  users, 
  currentUserRole, 
  onRoleChange,
  onSortByRole,
  selectedUsers = new Set(),
  onUserSelection,
  onSelectAll
}: UsersTableProps) {
  // Debug the current user role
  useEffect(() => {
    console.log(`UsersTable - Initialized with currentUserRole: ${currentUserRole}`);
  }, [currentUserRole]);

  // Check if selection is enabled (both handlers are provided)
  const selectionEnabled = !!onUserSelection && !!onSelectAll;
  
  // Calculate if all users are selected
  const allSelected = users.length > 0 && users.every(user => selectedUsers.has(user.id));
  
  // Handle toggling selection for all users
  const handleSelectAllChange = (checked: boolean) => {
    if (onSelectAll) {
      onSelectAll(checked);
    }
  };
  
  // Handle toggling selection for a single user
  const handleUserSelectionChange = (userId: string, checked: boolean) => {
    if (onUserSelection) {
      onUserSelection(userId, checked);
    }
  };

  // Just an example to show how you'd get email/id of current user: 
  // In real code, inject this as a prop, or via context
  const currentUserEmail = undefined; // TODO — supply as a prop/context as needed

  const isSuperAdmin = currentUserRole === 'super_admin';
  const isCurrentUserProtectedAdmin = isProtectedAdminId(currentUserEmail);

  // Updated role-permission checker, now correct and without type confusion
  const canAssignRole = (role: UserRole, userId: string): boolean => {
    // No direct type confusion now
    if (isSuperAdmin || isCurrentUserProtectedAdmin) {
      return true;
    }
    // Admin, but cannot assign super_admin
    if (currentUserRole === 'admin' && role !== 'super_admin') {
      return true;
    }
    // No rights
    return false;
  };

  // Helper function to get the current user's ID (using a placeholder for demonstration)
  const currentUserId = (): string => {
    // In a real implementation, this would come from auth context
    // For now, we'll use a placeholder that will be compared with
    return 'current-user-id';
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {selectionEnabled && (
              <TableHead className="w-12">
                <Checkbox 
                  checked={allSelected} 
                  onCheckedChange={handleSelectAllChange} 
                  aria-label="Select all users"
                />
              </TableHead>
            )}
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={onSortByRole} className="flex items-center gap-1">
                Role
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Categories</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={selectionEnabled ? 8 : 7} className="text-center py-6">
                No users found matching your search.
              </TableCell>
            </TableRow>
          ) : (
            users.map(user => (
              <TableRow key={user.id} className={selectedUsers.has(user.id) ? "bg-muted/20" : undefined}>
                {selectionEnabled && (
                  <TableCell>
                    <Checkbox 
                      checked={selectedUsers.has(user.id)} 
                      onCheckedChange={(checked) => handleUserSelectionChange(user.id, !!checked)}
                      aria-label={`Select ${user.display_name || 'user'}`}
                    />
                  </TableCell>
                )}
                <TableCell>
                  <UserAvatar 
                    avatarUrl={user.avatar_url} 
                    displayName={user.display_name || 'N/A'} 
                    userId={user.id} 
                  />
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {(user as any).email || 'N/A'}
                </TableCell>
                <TableCell>
                  <Badge 
                    className={
                      user.role === 'super_admin' ? 'bg-red-600' :
                      user.role === 'admin' ? 'bg-purple-600' :
                      user.role === 'category_manager' ? 'bg-blue-600' :
                      user.role === 'social_media_manager' ? 'bg-green-600' :
                      user.role === 'partner_manager' ? 'bg-amber-600' :
                      user.role === 'cfo' ? 'bg-emerald-600' :
                      'bg-slate-600'
                    }
                  >
                    {user.role ? (ROLE_DEFINITIONS[user.role]?.label || user.role) : 'Player'}
                  </Badge>
                </TableCell>
                <TableCell>{user.country || 'Not specified'}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.categories_played && user.categories_played.length > 0 ? (
                      user.categories_played.map((category) => (
                        <Badge key={category} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-sm">No categories</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
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
                        const canAssign = canAssignRole(roleDef.role, user.id);
                        const isCurrentRole = user.role === roleDef.role;
                        
                        console.log(`Role option for ${roleDef.role}: canAssign=${canAssign}, isCurrentRole=${isCurrentRole}`);
                        
                        return (
                          <DropdownMenuItem
                            key={roleDef.role}
                            onClick={() => {
                              console.log(`UsersTable - Changing role for ${user.id} to ${roleDef.role}, canAssign: ${canAssign}`);
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
