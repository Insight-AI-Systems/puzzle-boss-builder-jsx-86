
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Bug, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

interface AdminAccessCheckProps {
  userId: string | null;
  userRole: string;
  hasAdminAccess: boolean;
}

export const AdminAccessCheck: React.FC<AdminAccessCheckProps> = ({ 
  userId, 
  userRole, 
  hasAdminAccess 
}) => {
  const [debugInfo, setDebugInfo] = React.useState<string | null>(null);

  const showDebugInfo = () => {
    const info = {
      userId,
      userRole,
      hasAdminAccess,
      authSystem: 'clerk_rbac'
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
            <li>User ID: {userId || 'Not authenticated'}</li>
            <li>Role: {userRole}</li>
            <li>Has Admin Access: {hasAdminAccess ? 'Yes' : 'No'}</li>
            <li>Auth System: Clerk RBAC</li>
          </ul>
          <div className="mt-4">
            <p className="font-semibold">To get admin access:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Set up organization in Clerk Dashboard</li>
              <li>Create admin roles (super_admin, admin, etc.)</li>
              <li>Assign yourself the appropriate role</li>
            </ol>
          </div>
        </AlertDescription>
      </Alert>
      
      <div className="flex gap-2 mt-4">
        <Button onClick={showDebugInfo} variant="outline" size="sm">
          <Bug className="h-4 w-4 mr-1" />
          Show Debug Info
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.open('https://dashboard.clerk.com', '_blank')}
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          Clerk Dashboard
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
