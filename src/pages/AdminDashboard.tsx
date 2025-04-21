
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RoleBasedDashboard } from '@/components/admin/RoleBasedDashboard';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  const { profile, isLoading, isAdmin, currentUserId } = useUserProfile();
  const { hasRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Add enhanced logging for debugging
  const isSuperAdmin = hasRole('super_admin') || 
                      (profile?.role === 'super_admin') || 
                      (profile?.id === 'alan@insight-ai-systems.com');

  // Add debug logging
  useEffect(() => {
    if (isLoading) return;
    
    console.log('Admin Dashboard - Auth State:', { 
      isLoggedIn: !!currentUserId,
      profileId: profile?.id, 
      isAdmin,
      isSuperAdmin,
      role: profile?.role,
      hasRoleSuperAdmin: hasRole('super_admin'),
      profileRoleIsSuperAdmin: profile?.role === 'super_admin',
      isProtectedAdmin: profile?.id === 'alan@insight-ai-systems.com'
    });
  }, [isLoading, isAdmin, isSuperAdmin, profile, currentUserId, hasRole]);

  // Consolidated useEffect for access checks and logging
  useEffect(() => {
    if (isLoading) return;
    
    // Force grant access to special account or super admin
    if (isSuperAdmin) {
      console.log('Protected super admin detected, access granted');
      return;
    }
    
    // Check access for regular users
    if (!isAdmin && !isSuperAdmin && currentUserId) {
      console.log('Access denied, redirecting to home');
      toast({
        title: "Access Denied",
        description: `You don't have admin privileges. Current role: ${profile?.role || 'unknown'}`,
        variant: "destructive",
      });
      navigate('/', { replace: true });
    } else if (isAdmin || isSuperAdmin) {
      console.log('Admin access granted');
    }
  }, [isLoading, isAdmin, isSuperAdmin, navigate, profile, currentUserId, toast]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-puzzle-black p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
      </div>
    );
  }

  // Super admin or admin dashboard
  if (isSuperAdmin || isAdmin) {
    return (
      <div className="min-h-screen bg-puzzle-black p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-3xl font-game text-puzzle-aqua">
            {isSuperAdmin ? 'Super Admin Dashboard' : 'Admin Dashboard'}
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

  // Access denied case (fallback)
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
