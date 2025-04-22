import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Search, Shield, UserCog, ChevronDown } from "lucide-react";
import { UserProfile, UserRole, ROLE_DEFINITIONS } from '@/types/userTypes';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Define a consistent protected admin identifier
const PROTECTED_ADMIN_EMAIL = 'alan@insight-ai-systems.com';

export function RoleManagement() {
  const { allProfiles, isLoadingProfiles, updateUserRole, profile: currentUserProfile } = useUserProfile();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  const currentUserRole = currentUserProfile?.role || 'player';
  const currentUserEmail = currentUserProfile?.id;
  const isSuperAdmin = currentUserRole === 'super_admin';
  const isCurrentUserProtectedAdmin = currentUserEmail === PROTECTED_ADMIN_EMAIL;
  const canAssignAnyRole = isSuperAdmin || isCurrentUserProtectedAdmin;
  
  console.log('RoleManagement - Current user:', {
    role: currentUserRole, 
    email: currentUserEmail,
    isSuperAdmin,
    isCurrentUserProtectedAdmin,
    canAssignAnyRole
  });
  
  // Filter profiles based on search term
  const profilesData = allProfiles?.data || [];
  
  const filteredProfiles = profilesData.filter(profile => 
    profile.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.id.includes(searchTerm)
  );

  // Handle role change action
  const handleRoleChange = (userId: string, newRole: UserRole) => {
    updateUserRole.mutate({ targetUserId: userId, newRole }, {
      onSuccess: () => {
        toast({
          title: "Role updated",
          description: `User role has been updated to ${newRole}`,
        });
      },
      onError: (error) => {
        toast({
          title: "Role update failed",
          description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          variant: "destructive",
        });
      }
    });
  };

  // Helper function to determine if current user can assign a role
  const canAssignRole = (role: UserRole, userId: string): boolean => {
    // Special case: Only the protected admin or super admins can change protected admin
    if (userId === PROTECTED_ADMIN_EMAIL) {
      return canAssignAnyRole;
    }
    
    // Super admin can assign any role
    if (canAssignAnyRole) return true;
    
    // Previously checked for admin role, now we check if current user is super_admin
    if (currentUserRole === 'super_admin' && role !== 'super_admin') return true;
    
    return false;
  };

  if (isLoadingProfiles) {
    return <div>Loading users...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserCog className="h-5 w-5 mr-2" />
          Role Management
        </CardTitle>
        <CardDescription>Manage user roles and permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-background/50"
            />
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfiles.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar_url || ''} alt={user.display_name || ''} />
                        <AvatarFallback>
                          {user.display_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {user.display_name || 'Anonymous User'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {user.id.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        user.role === 'super_admin' ? 'bg-red-600' :
                        user.role === 'category_manager' ? 'bg-blue-600' :
                        user.role === 'social_media_manager' ? 'bg-green-600' :
                        user.role === 'partner_manager' ? 'bg-amber-600' :
                        user.role === 'cfo' ? 'bg-emerald-600' :
                        'bg-slate-600'
                      }
                    >
                      {ROLE_DEFINITIONS[user.role]?.label || user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {ROLE_DEFINITIONS[user.role]?.permissions.slice(0, 3).map((perm) => (
                        <Badge key={perm} variant="outline" className="text-xs">
                          {perm}
                        </Badge>
                      ))}
                      {ROLE_DEFINITIONS[user.role]?.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{ROLE_DEFINITIONS[user.role].permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
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
                        {Object.values(ROLE_DEFINITIONS).map((roleInfo) => {
                          const canAssign = canAssignRole(roleInfo.role, user.id);
                          const isCurrentRole = user.role === roleInfo.role;
                          
                          console.log(`Role option for ${user.id}, role=${roleInfo.role}: canAssign=${canAssign}, isCurrentRole=${isCurrentRole}`);
                          
                          return (
                            <DropdownMenuItem
                              key={roleInfo.role}
                              onClick={() => handleRoleChange(user.id, roleInfo.role)}
                              disabled={!canAssign || user.role === roleInfo.role}
                              className={user.role === roleInfo.role ? 'bg-muted font-medium' : ''}
                            >
                              {roleInfo.label}
                              {user.role === roleInfo.role && " (current)"}
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
