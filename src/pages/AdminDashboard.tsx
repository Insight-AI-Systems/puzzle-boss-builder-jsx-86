
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RoleBasedDashboard } from '@/components/admin/RoleBasedDashboard';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

// Special admin email that should always have access
const PROTECTED_ADMIN_EMAIL = 'alan@insight-ai-systems.com';

const AdminDashboard = () => {
  const { profile, isLoading, isAdmin, currentUserId } = useUserProfile();
  const { hasRole, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Enhanced admin access check with special case for Alan
  const isProtectedAdmin = user?.email === PROTECTED_ADMIN_EMAIL;
  const isSuperAdmin = 
    isProtectedAdmin || 
    hasRole('super_admin') || 
    (profile?.role === 'super_admin');

  useEffect(() => {
    if (isLoading) return;
    
    // Detailed access logging for debugging
    console.log('AdminDashboard - Full Admin Access Check:', { 
      isLoggedIn: !!currentUserId,
      userId: currentUserId,
      profileId: profile?.id, 
      email: user?.email,
      isAdmin,
      isSuperAdmin,
      isProtectedAdmin,
      role: profile?.role,
      hasRoleSuperAdmin: hasRole('super_admin'),
      profileRoleIsSuperAdmin: profile?.role === 'super_admin',
    });

    // Special case for Alan - always grant access
    if (isProtectedAdmin) {
      console.log('AdminDashboard - Protected admin detected, granting full admin access');
      return;
    }
    
    // Check access for regular users
    if (!isAdmin && !isSuperAdmin && currentUserId) {
      console.log('AdminDashboard - Access denied, redirecting to homepage');
      toast({
        title: "Access Denied",
        description: `You don't have admin privileges. Current role: ${profile?.role || 'unknown'}`,
        variant: "destructive",
      });
      navigate('/', { replace: true });
    }
  }, [isLoading, isAdmin, isSuperAdmin, navigate, profile, currentUserId, toast, user?.email, isProtectedAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-puzzle-black p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
      </div>
    );
  }

  // Grant access if user is protected admin, regular admin or has super admin role
  if (isProtectedAdmin || isSuperAdmin || isAdmin) {
    return (
      <div className="min-h-screen bg-puzzle-black p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-3xl font-game text-puzzle-aqua">
            {isProtectedAdmin || isSuperAdmin ? 'Super Admin Dashboard' : 'Admin Dashboard'}
          </h1>

          {/* Puzzle Test Playground Button */}
          <div className="mb-6">
            <Button asChild variant="outline" size="lg">
              <Link to="/puzzle-playground">
                Open Puzzle Engine Test Playground
              </Link>
            </Button>
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
