
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { RoleUserTable } from './RoleUserTable';

export function RoleManagement() {
  const { userRole } = useAuth();
  const { allProfiles, isLoadingProfiles, updateUserRole } = useUserProfile();

  if (!userRole || (userRole !== 'super_admin' && userRole !== 'admin')) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">You don't have permission to access role management.</p>
        </CardContent>
      </Card>
    );
  }

  const handleRoleUpdate = async (targetUserId: string, newRole: string) => {
    try {
      await updateUserRole.mutate({ targetUserId, newRole });
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Role Management
        </CardTitle>
        <CardDescription>
          Manage user roles and permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">User Roles</h3>
            <Badge variant="secondary">
              {allProfiles.data.length} total users
            </Badge>
          </div>

          <RoleUserTable
            users={allProfiles.data}
            isLoading={isLoadingProfiles}
            onRoleUpdate={handleRoleUpdate}
            currentUserRole={userRole}
          />
        </div>
      </CardContent>
    </Card>
  );
}
