
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Bug } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { debugAuthState, forceProtectedAdminAccess } from '@/utils/admin/debugAuth';

interface AdminAccessCheckProps {
  user: any;
  userRole: string | undefined;
  hasRole: (role: string) => boolean;
  profile?: { role?: string };
}

export const AdminAccessCheck: React.FC<AdminAccessCheckProps> = ({ 
  user, 
  userRole, 
  hasRole, 
  profile 
}) => {
  const [debugInfo, setDebugInfo] = React.useState<string | null>(null);

  const showDebugInfo = () => {
    const info = {
      user: user ? {
        id: user.id,
        email: user.email,
        role: userRole
      } : null,
      profile: profile ? {
        id: profile.id,
        role: profile.role,
        email: profile.email || profile.id
      } : null,
      hasRoles: {
        superAdmin: hasRole('super_admin'),
        player: hasRole('player')
      }
    };
    
    setDebugInfo(JSON.stringify(info, null, 2));
    console.log('Debug Info:', info);
  };

  return (
    <div className="min-h-screen bg-puzzle-black p-6">
      <Alert variant="destructive" className="mb-4">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          <p>You do not have permission to access the admin dashboard.</p>
          <p className="mt-2">Current user info:</p>
          <ul className="list-disc pl-6 mt-1">
            <li>Email: {user.email}</li>
            <li>Role: {userRole || profile?.role || 'Unknown'}</li>
            <li>Has Super Admin Role: {hasRole('super_admin') ? 'Yes' : 'No'}</li>
          </ul>
        </AlertDescription>
      </Alert>
      
      <div className="flex gap-2 mt-4">
        <Button onClick={showDebugInfo} variant="outline" size="sm">
          <Bug className="h-4 w-4 mr-1" />
          Show Debug Info
        </Button>
        <Button onClick={() => debugAuthState()} variant="outline" size="sm">
          Debug Auth State
        </Button>
        <Button onClick={() => forceProtectedAdminAccess()} variant="outline" size="sm">
          Force Admin Access
        </Button>
        <Button asChild variant="default" size="sm">
          <Link to="/">Return Home</Link>
        </Button>
      </div>
      
      {debugInfo && (
        <pre className="mt-4 p-4 bg-black/30 text-white rounded-md overflow-x-auto text-xs">
          {debugInfo}
        </pre>
      )}
    </div>
  );
};
