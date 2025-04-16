
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, ChevronDown, User, Shield, UserCog } from "lucide-react";
import { useUserProfile } from '@/hooks/useUserProfile';
import { UserProfile, UserRole, ROLE_DEFINITIONS } from '@/types/userTypes';

export function UserManagement() {
  const { allProfiles, isLoadingProfiles, updateUserRole, profile: currentUserProfile } = useUserProfile();
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleRoleChange = (userId: string, newRole: UserRole) => {
    updateUserRole.mutate({ targetUserId: userId, newRole });
  };

  const currentUserRole = currentUserProfile?.role || 'player';
  
  // Filter profiles based on search term
  const filteredProfiles = allProfiles?.filter(profile => 
    profile.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.id.includes(searchTerm)
  );

  if (isLoadingProfiles) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Loading user data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!allProfiles || allProfiles.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>No users found or you don't have permission to view users.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Helper function to determine if current user can assign a role
  const canAssignRole = (role: UserRole): boolean => {
    return ROLE_DEFINITIONS[role].canBeAssignedBy.includes(currentUserRole as UserRole);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserCog className="h-5 w-5 mr-2" />
          User Management
        </CardTitle>
        <CardDescription>Manage user accounts and permissions</CardDescription>
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
                <TableHead>Credits</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfiles?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar_url || ''} alt={user.display_name || ''} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {user.display_name || 'Anonymous'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ID: {user.id.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
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
                      {ROLE_DEFINITIONS[user.role]?.label || user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.credits || 0}</TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Shield className="h-4 w-4 mr-1" />
                          Role
                          <ChevronDown className="h-4 w-4 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Change role</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {Object.values(ROLE_DEFINITIONS).map((roleInfo) => (
                          <DropdownMenuItem
                            key={roleInfo.role}
                            onClick={() => handleRoleChange(user.id, roleInfo.role)}
                            disabled={!canAssignRole(roleInfo.role) || user.role === roleInfo.role}
                            className={user.role === roleInfo.role ? 'bg-muted font-medium' : ''}
                          >
                            {roleInfo.label}
                            {user.role === roleInfo.role && " (current)"}
                          </DropdownMenuItem>
                        ))}
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
