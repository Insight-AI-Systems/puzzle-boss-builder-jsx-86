
import React from 'react';
import { useClerkAuth } from '@/hooks/useClerkAuth';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const AdminDebugInfo: React.FC = () => {
  const clerkAuth = useClerkAuth();
  const contextAuth = useAuth();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Admin Access Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Clerk Auth Hook:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>User Email: {clerkAuth.user?.primaryEmailAddress?.emailAddress || 'N/A'}</div>
            <div>User Role: <Badge>{clerkAuth.userRole}</Badge></div>
            <div>Is Admin: <Badge variant={clerkAuth.isAdmin ? 'default' : 'secondary'}>{clerkAuth.isAdmin ? 'Yes' : 'No'}</Badge></div>
            <div>Is Authenticated: <Badge variant={clerkAuth.isAuthenticated ? 'default' : 'secondary'}>{clerkAuth.isAuthenticated ? 'Yes' : 'No'}</Badge></div>
            <div>Has Super Admin: <Badge variant={clerkAuth.hasRole('super_admin') ? 'default' : 'secondary'}>{clerkAuth.hasRole('super_admin') ? 'Yes' : 'No'}</Badge></div>
            <div>Has Admin: <Badge variant={clerkAuth.hasRole('admin') ? 'default' : 'secondary'}>{clerkAuth.hasRole('admin') ? 'Yes' : 'No'}</Badge></div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">Auth Context:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>User Role: <Badge>{contextAuth.userRole}</Badge></div>
            <div>Is Admin: <Badge variant={contextAuth.isAdmin ? 'default' : 'secondary'}>{contextAuth.isAdmin ? 'Yes' : 'No'}</Badge></div>
            <div>Is Authenticated: <Badge variant={contextAuth.isAuthenticated ? 'default' : 'secondary'}>{contextAuth.isAuthenticated ? 'Yes' : 'No'}</Badge></div>
            <div>Has Super Admin: <Badge variant={contextAuth.hasRole('super_admin') ? 'default' : 'secondary'}>{contextAuth.hasRole('super_admin') ? 'Yes' : 'No'}</Badge></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
