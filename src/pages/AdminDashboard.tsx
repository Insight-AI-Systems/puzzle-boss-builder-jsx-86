
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ShieldAlert } from 'lucide-react';
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
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Simple admin access check
  const isProtectedAdmin = user?.email === PROTECTED_ADMIN_EMAIL;
  const isSuperAdmin = isProtectedAdmin || hasRole('super_admin');
  const isAdminUser = isProtectedAdmin || isSuperAdmin || hasRole('admin');

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-puzzle-black p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
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
              <Button asChild variant="outline" size="lg">
                <Link to="/puzzle-playground">
                  Open Puzzle Engine Test Playground
                </Link>
              </Button>
            </div>
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
