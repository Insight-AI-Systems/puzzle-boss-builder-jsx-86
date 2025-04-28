
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserManagement as OriginalUserManagement } from '@/components/admin/user-management/UserManagement';

export const UserManagement: React.FC = () => {
  // Check if the original component exists and use it, otherwise use a placeholder
  try {
    return <OriginalUserManagement />;
  } catch (e) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <p>User management functionality is being set up. Please check back later.</p>
        </CardContent>
      </Card>
    );
  }
};

export default UserManagement;
