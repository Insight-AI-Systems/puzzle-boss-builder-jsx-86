
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserProfile, UserRole, ROLE_DEFINITIONS } from '@/types/userTypes';
import { useUserProfile } from '@/hooks/useUserProfile';
import { RoleUserTable } from './RoleUserTable';

export function RoleManagement() {
  const { profile: currentUserProfile } = useUserProfile();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const currentUserRole: UserRole = (currentUserProfile?.role as UserRole) || 'player';
  const currentUserEmail = currentUserProfile?.email;
  
  // Check admin privileges based on role, not hardcoded emails
  const isSuperAdmin = currentUserRole === 'super-admin';
  const isAdmin = currentUserRole === 'admin';
  const canAssignAnyRole = isSuperAdmin;

  // Mock profiles data for now since we don't have allProfiles working yet
  const profilesData: UserProfile[] = [];
  const filteredProfiles = profilesData.filter(profile =>
    profile.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.id.includes(searchTerm)
  );

  // Handle role change action
  const handleRoleChange = (userId: string, newRole: UserRole) => {
    // Mock implementation for now
    toast({
      title: "Role updated",
      description: `User role has been updated to ${newRole}`,
    });
  };

  // Helper function to determine if current user can assign a role
  const canAssignRole = (role: UserRole, userId: string): boolean => {
    // Super admins can assign any role
    if (isSuperAdmin) return true;
    
    // Regular admins can assign roles except super-admin
    if (isAdmin && role !== 'super-admin') return true;
    
    return false;
  };

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
