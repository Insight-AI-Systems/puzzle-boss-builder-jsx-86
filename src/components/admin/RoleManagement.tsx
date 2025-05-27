
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserProfile, UserRole, ROLE_DEFINITIONS } from '@/types/userTypes';
import { useUserProfile } from '@/hooks/useUserProfile';
import { RoleUserTable } from './RoleUserTable';

const PROTECTED_ADMIN_EMAIL = 'alan@insight-ai-systems.com';

export function RoleManagement() {
  const { allProfiles, isLoadingProfiles, updateUserRole, profile: currentUserProfile } = useUserProfile();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const currentUserRole: UserRole = currentUserProfile?.role || 'player';
  const currentUserEmail = currentUserProfile?.id;
  
  // Fix the type comparison by using type assertion
  const isSuperAdmin = currentUserRole === 'super_admin' as UserRole;
  const isCurrentUserProtectedAdmin = currentUserEmail === PROTECTED_ADMIN_EMAIL;
  const canAssignAnyRole = isSuperAdmin || isCurrentUserProtectedAdmin;

  // Filter profiles based on search term
  const profilesData: UserProfile[] = allProfiles?.data || [];
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
    if (userId === PROTECTED_ADMIN_EMAIL) {
      return canAssignAnyRole;
    }
    if (canAssignAnyRole) return true;
    if (currentUserRole === 'super_admin' as UserRole && role !== 'super_admin' as UserRole) return true;
    return false;
  };

  if (isLoadingProfiles) {
    return <div>Loading users...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
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
        <RoleUserTable
          profiles={filteredProfiles}
          currentUserRole={currentUserRole}
          currentUserEmail={currentUserEmail}
          handleRoleChange={handleRoleChange}
          canAssignRole={canAssignRole}
        />
      </CardContent>
    </Card>
  );
}
