
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ShieldAlert, Bug } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RoleBasedDashboard } from '@/components/admin/RoleBasedDashboard';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { debugAuthState, forceProtectedAdminAccess } from '@/utils/admin/debugAuth';

// Special admin email that should always have access
const PROTECTED_ADMIN_EMAIL = 'alan@insight-ai-systems.com';

const AdminDashboard = () => {
  const { profile, isLoading } = useUserProfile();
  const { user, hasRole, session, userRole, userRoles } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Simple admin access check
  const isProtectedAdmin = user?.email === PROTECTED_ADMIN_EMAIL;
  const isSuperAdmin = isProtectedAdmin || hasRole('super_admin');
  const isAdminUser = isProtectedAdmin || isSuperAdmin || hasRole('admin');

  // Add more detailed logging to diagnose the issue
  console.log('AdminDashboard - Debug Info:', {
    currentUrl: window.location.href,
    isLoadingProfile: isLoading,
    hasUser: !!user,
    userEmail: user?.email,
    userIdFromProfile: profile?.id,
    userEmailFromProfile: profile?.email,
    profileRole: profile?.role,
    isProtectedAdmin,
    isSuperAdmin,
    isAdminUser,
    hasAdminRole: hasRole('admin'),
    hasSuperAdminRole: hasRole('super_admin'),
    userRoles,
    userRole
  });

  useEffect(() => {
    if (isLoading) return;
    
    console.log('AdminDashboard - Access Check:', { 
      isLoggedIn: !!user,
      userEmail: user?.email,
      isProtectedAdmin,
      isSuperAdmin,
      isAdminUser,
      profileRole: profile?.role
    });

    // Special case for Alan - always grant access
    if (isProtectedAdmin) {
      console.log('AdminDashboard - Protected admin detected, granting full access');
      return;
    }
    
    // Check access for regular users
    if (!isAdminUser && user) {
      console.log('AdminDashboard - Access denied, redirecting to homepage');
      toast({
        title: "Access Denied",
        description: `You don't have admin privileges. Current role: ${profile?.role || 'unknown'}`,
        variant: "destructive",
      });
      navigate('/', { replace: true });
    }
  }, [isLoading, isAdminUser, navigate, profile, user, toast, isProtectedAdmin]);

  // Function to show detailed debug info
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
      sessionExists: !!session,
      hasRoles: {
        admin: hasRole('admin'),
        superAdmin: hasRole('super_admin'),
        player: hasRole('player')
      },
      availableRoles: userRoles
    };
    
    setDebugInfo(JSON.stringify(info, null, 2));
    console.log('Debug Info:', info);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-puzzle-black p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
      </div>
    );
  }

  // Show an intermediate debug screen when there's a discrepancy
  if (user && !isAdminUser && !isLoading) {
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
              <li>Has Admin Role: {hasRole('admin') ? 'Yes' : 'No'}</li>
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
  }

  // Grant access if user is protected admin, super admin or has admin role
  if (isProtectedAdmin || isSuperAdmin || isAdminUser) {
    return (
      <div className="min-h-screen bg-puzzle-black p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-3xl font-game text-puzzle-aqua">
            {isProtectedAdmin || isSuperAdmin ? 'Super Admin Dashboard' : 'Admin Dashboard'}
          </h1>

          {/* Admin Tools Section */}
          <div className="mb-6 space-y-2">
            <h2 className="text-xl font-game text-puzzle-gold">Admin Tools</h2>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => debugAuthState()} variant="outline" size="sm">
                Debug Auth State
              </Button>
              <Button onClick={() => forceProtectedAdminAccess()} variant="outline" size="sm">
                Force Admin Access
              </Button>
              <Button onClick={showDebugInfo} variant="outline" size="sm">
                <Bug className="h-4 w-4 mr-1" />
                Show Debug Info
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/puzzle-playground">
                  Open Puzzle Engine Test Playground
                </Link>
              </Button>
            </div>
            
            {debugInfo && (
              <pre className="mt-4 p-4 bg-black/30 text-white rounded-md overflow-x-auto text-xs">
                {debugInfo}
              </pre>
            )}
          </div>

          <RoleBasedDashboard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-puzzle-black p-6">
      <Alert variant="destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          You do not have permission to access the admin dashboard.
          {profile && (
            <p className="mt-2">Your current role: {profile.role}</p>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AdminDashboard;
