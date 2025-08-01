
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const AdminDebugInfo: React.FC = () => {
  const auth = useAuth();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Admin Access Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">Supabase Auth Status:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>User Email: {auth.user?.email || 'N/A'}</div>
            <div>User Role: <Badge>{auth.userRole}</Badge></div>
            <div>Is Admin: <Badge variant={auth.isAdmin ? 'default' : 'secondary'}>{auth.isAdmin ? 'Yes' : 'No'}</Badge></div>
            <div>Is Authenticated: <Badge variant={auth.isAuthenticated ? 'default' : 'secondary'}>{auth.isAuthenticated ? 'Yes' : 'No'}</Badge></div>
            <div>Has Super Admin: <Badge variant={auth.hasRole('super_admin') ? 'default' : 'secondary'}>{auth.hasRole('super_admin') ? 'Yes' : 'No'}</Badge></div>
            <div>Profile ID: {auth.profile?.id || 'N/A'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
