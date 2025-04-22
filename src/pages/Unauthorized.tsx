
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { debugAuthState } from '@/utils/admin/debugAuth';

const Unauthorized: React.FC = () => {
  const { user, userRole, userRoles, hasRole, session } = useAuth();
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  
  console.log('Unauthorized page - User info:', {
    isLoggedIn: !!user,
    userId: user?.id,
    userEmail: user?.email,
    userRole,
    userRoles,
    hasAdminRole: hasRole('admin'),
    hasSuperAdminRole: hasRole('super_admin')
  });

  // Function to show detailed debug info
  const showDebugInfo = () => {
    const info = {
      user: user ? {
        id: user.id,
        email: user.email,
      } : null,
      sessionExists: !!session,
      role: userRole,
      hasRoles: {
        admin: hasRole('admin'),
        superAdmin: hasRole('super_admin'),
        player: hasRole('player')
      },
      availableRoles: userRoles,
      referrer: document.referrer,
      currentPath: window.location.pathname
    };
    
    setDebugInfo(JSON.stringify(info, null, 2));
    console.log('Debug Info:', info);
  };

  return (
    <div className="min-h-screen bg-puzzle-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-red-900/30 flex items-center justify-center">
          <Shield className="h-8 w-8 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-puzzle-aqua">Access Denied</h1>
        
        <p className="text-lg">
          {user ? (
            <>Your account doesn't have permission to access this page.</>
          ) : (
            <>You need to be logged in with appropriate permissions to access this page.</>
          )}
        </p>

        {user && (
          <div className="text-left p-4 bg-red-900/20 rounded-md">
            <p className="font-semibold mb-2">Current User Information:</p>
            <ul className="space-y-1 text-sm">
              <li><span className="opacity-70">Email:</span> {user.email}</li>
              <li><span className="opacity-70">Role:</span> {userRole || 'Unknown'}</li>
              <li><span className="opacity-70">Admin Access:</span> {hasRole('admin') ? 'Yes' : 'No'}</li>
              <li><span className="opacity-70">Super Admin Access:</span> {hasRole('super_admin') ? 'Yes' : 'No'}</li>
            </ul>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button asChild variant="outline" className="border-puzzle-aqua/30">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
          
          {!user && (
            <Button asChild className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
          
          <Button 
            onClick={showDebugInfo} 
            variant="outline" 
            className="border-puzzle-aqua/30"
          >
            <Bug className="mr-2 h-4 w-4" />
            Debug Info
          </Button>
          
          <Button 
            onClick={() => debugAuthState()} 
            variant="outline" 
            className="border-puzzle-aqua/30"
          >
            Debug Auth State
          </Button>
        </div>
        
        {debugInfo && (
          <pre className="mt-4 p-4 bg-black/30 text-white rounded-md overflow-x-auto text-xs text-left">
            {debugInfo}
          </pre>
        )}
      </div>
    </div>
  );
};

export default Unauthorized;
