
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserManagement as OriginalUserManagement } from './user-management/UserManagement';

export const UserManagement: React.FC = () => {
  // Use a try-catch to safely render the component
  try {
    return <OriginalUserManagement />;
  } catch (e) {
    console.error("Error rendering UserManagement:", e);
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
