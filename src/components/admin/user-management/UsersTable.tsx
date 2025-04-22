
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDistanceToNow, format } from 'date-fns';

interface UsersTableProps {
  users: UserProfile[];
  currentUserRole: UserRole;
  currentUserEmail?: string;
  onRoleChange: (userId: string, newRole: UserRole) => void;
  onSortByRole: () => void;
  onSortByLastLogin?: (direction: 'asc' | 'desc') => void;
  selectedUsers?: Set<string>;
  onUserSelection?: (userId: string, isSelected: boolean) => void;
  onSelectAll?: (isSelected: boolean) => void;
  lastLoginSortDirection?: 'asc' | 'desc';
}

const PROTECTED_ADMIN_EMAIL = 'alan@insight-ai-systems.com';
function isProtectedAdminId(id?: string) {
  return id === PROTECTED_ADMIN_EMAIL;
}

export function UsersTable({ 
  users, 
  currentUserRole, 
  currentUserEmail,
  onRoleChange,
  onSortByRole,
  onSortByLastLogin,
  selectedUsers = new Set(),
  onUserSelection,
  onSelectAll,
  lastLoginSortDirection
}: UsersTableProps) {
  useEffect(() => {
    console.log(`UsersTable - Initialized with currentUserRole: ${currentUserRole}, currentUserEmail: ${currentUserEmail}`);
  }, [currentUserRole, currentUserEmail]);

  const selectionEnabled = !!onUserSelection && !!onSelectAll;
  
  const allSelected = users.length > 0 && users.every(user => selectedUsers.has(user.id));
  
  const handleSelectAllChange = (checked: boolean) => {
    if (onSelectAll) {
      onSelectAll(checked);
    }
  };
  
  const handleUserSelectionChange = (userId: string, checked: boolean) => {
    if (onUserSelection) {
      onUserSelection(userId, checked);
    }
  };

  const isSuperAdmin = currentUserRole === 'super_admin';
  const isCurrentUserProtectedAdmin = isProtectedAdminId(currentUserEmail);
  const canAssignAnyRole = isSuperAdmin || isCurrentUserProtectedAdmin;

  const canAssignRole = (role: UserRole, userId: string): boolean => {
    if (canAssignAnyRole) {
      return true;
    }
    
    if (isProtectedAdminId(userId)) {
      return isCurrentUserProtectedAdmin;
    }
    
    if (currentUserRole === 'admin' && role !== 'super_admin') {
      return true;
    }
    
    return false;
  };

  console.log('UsersTable permission debug:', {
    isSuperAdmin,
    isCurrentUserProtectedAdmin,
    canAssignAnyRole,
    currentUserRole,
    currentUserEmail
  });

  const handleSortByLastLogin = () => {
    if (onSortByLastLogin) {
      onSortByLastLogin(lastLoginSortDirection === 'asc' ? 'desc' : 'asc');
    }
  };

  const formatLastLogin = (date: string | null) => {
    if (!date) return 'Never';
    const loginDate = new Date(date);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - loginDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 30) {
      return formatDistanceToNow(loginDate, { addSuffix: true });
    }
    return format(loginDate, 'MMM d, yyyy');
  };

  const getInactiveStatus = (lastLogin: string | null) => {
    if (!lastLogin) return true;
    const loginDate = new Date(lastLogin);
    const now = new Date();
    return (now.getTime() - loginDate.getTime()) > (30 * 24 * 60 * 60 * 1000);
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
            <TableHead>
              <Button variant="ghost" onClick={handleSortByLastLogin} className="flex items-center gap-1">
                Last Login
                {lastLoginSortDirection && (
                  <ArrowUpDown className="h-4 w-4" />
                )}
              </Button>
            </TableHead>
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
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center gap-2">
                          {getInactiveStatus(user.last_sign_in) && (
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                          )}
                          {formatLastLogin(user.last_sign_in)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {user.last_sign_in 
                          ? format(new Date(user.last_sign_in), 'PPpp')
                          : 'User has never logged in'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
