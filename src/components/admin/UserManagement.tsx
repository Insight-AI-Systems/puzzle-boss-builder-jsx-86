
import React, { useState, useMemo } from 'react';
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
import { Search, ChevronDown, User, Shield, UserCog, ChevronUp, SortAsc, SortDesc } from "lucide-react";
import { useUserProfile } from '@/hooks/useUserProfile';
import { UserProfile, UserRole, ROLE_DEFINITIONS } from '@/types/userTypes';
import { useToast } from '@/hooks/use-toast';

export function UserManagement() {
  const { allProfiles, isLoadingProfiles, updateUserRole, profile: currentUserProfile } = useUserProfile();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' }>({
    key: 'display_name',
    direction: 'ascending'
  });
  const { toast } = useToast();
  
  const currentUserRole = currentUserProfile?.role || 'player';
  
  // Handle sort request for a column
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Get sort icon for a column
  const getSortIcon = (columnName: string) => {
    if (sortConfig.key !== columnName) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? 
      <SortAsc className="h-4 w-4 inline ml-1" /> : 
      <SortDesc className="h-4 w-4 inline ml-1" />;
  };

  // Filter and sort profiles based on search term and sort config
  const filteredAndSortedProfiles = useMemo(() => {
    if (!allProfiles) return [];
    
    // First filter based on search term
    let result = allProfiles.filter(profile => 
      profile.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ROLE_DEFINITIONS[profile.role]?.label || profile.role).toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Then sort based on sort config
    result.sort((a, b) => {
      if (sortConfig.key === 'display_name') {
        const aValue = a.display_name || '';
        const bValue = b.display_name || '';
        if (sortConfig.direction === 'ascending') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      } else if (sortConfig.key === 'role') {
        const aValue = ROLE_DEFINITIONS[a.role]?.label || a.role;
        const bValue = ROLE_DEFINITIONS[b.role]?.label || b.role;
        return sortConfig.direction === 'ascending' ? 
          aValue.localeCompare(bValue) : 
          bValue.localeCompare(aValue);
      } else if (sortConfig.key === 'credits') {
        const aValue = a.credits || 0;
        const bValue = b.credits || 0;
        return sortConfig.direction === 'ascending' ? 
          aValue - bValue : 
          bValue - aValue;
      } else if (sortConfig.key === 'created_at') {
        const aValue = new Date(a.created_at).getTime();
        const bValue = new Date(b.created_at).getTime();
        return sortConfig.direction === 'ascending' ? 
          aValue - bValue : 
          bValue - aValue;
      }
      return 0;
    });
    
    return result;
  }, [allProfiles, searchTerm, sortConfig]);

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    updateUserRole.mutate(
      { targetUserId: userId, newRole },
      {
        onSuccess: () => {
          toast({
            title: "Role updated",
            description: `User role has been updated to ${ROLE_DEFINITIONS[newRole]?.label || newRole}`,
            duration: 3000,
          });
        },
        onError: (error) => {
          toast({
            title: "Role update failed",
            description: `Error: ${error instanceof Error ? error.message : 'You do not have permission to update this role.'}`,
            variant: 'destructive',
            duration: 5000,
          });
        }
      }
    );
  };

  // Helper function to determine if current user can assign a role
  const canAssignRole = (role: UserRole): boolean => {
    return ROLE_DEFINITIONS[role].canBeAssignedBy.includes(currentUserRole as UserRole);
  };

  if (isLoadingProfiles) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Loading user data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-puzzle-aqua"></div>
          </div>
        </CardContent>
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
              placeholder="Search users by name, ID, or role..."
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
                <TableHead onClick={() => requestSort('display_name')} className="cursor-pointer">
                  User {getSortIcon('display_name')}
                </TableHead>
                <TableHead onClick={() => requestSort('role')} className="cursor-pointer">
                  Role {getSortIcon('role')}
                </TableHead>
                <TableHead onClick={() => requestSort('credits')} className="cursor-pointer">
                  Credits {getSortIcon('credits')}
                </TableHead>
                <TableHead onClick={() => requestSort('created_at')} className="cursor-pointer">
                  Joined {getSortIcon('created_at')}
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedProfiles.map((user) => (
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
                          Change Role
                          <ChevronDown className="h-4 w-4 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Assign Role</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {Object.values(ROLE_DEFINITIONS).map((roleInfo) => (
                          <DropdownMenuItem
                            key={roleInfo.role}
                            onClick={() => handleRoleChange(user.id, roleInfo.role)}
                            disabled={!canAssignRole(roleInfo.role) || user.role === roleInfo.role}
                            className={user.role === roleInfo.role ? 'bg-muted font-medium' : ''}
                          >
                            <Badge 
                              variant="outline" 
                              className={`mr-2 ${
                                roleInfo.role === 'super_admin' ? 'border-red-600' :
                                roleInfo.role === 'admin' ? 'border-purple-600' :
                                roleInfo.role === 'category_manager' ? 'border-blue-600' :
                                roleInfo.role === 'social_media_manager' ? 'border-green-600' :
                                roleInfo.role === 'partner_manager' ? 'border-amber-600' :
                                roleInfo.role === 'cfo' ? 'border-emerald-600' :
                                'border-slate-600'
                              }`}
                            >
                              {roleInfo.label}
                            </Badge>
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
