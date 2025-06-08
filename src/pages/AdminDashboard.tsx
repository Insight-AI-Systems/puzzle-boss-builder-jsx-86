
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { RoleBasedDashboard } from '@/components/admin/RoleBasedDashboard';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import { useClerkAuth } from '@/hooks/useClerkAuth';
import { AdminAccessCheck } from '@/components/admin/dashboard/AdminAccessCheck';
import { AdminToolbar } from '@/components/admin/dashboard/AdminToolbar';
import { AdminErrorBoundary } from '@/components/admin/ErrorBoundary';
import { adminLog, DebugLevel } from '@/utils/debug';

const AdminDashboard = () => {
  const { profile, isLoading: profileLoading } = useUserProfile();
  const { user, hasRole, userRole, isAdmin, isAuthenticated, isLoading: authLoading } = useClerkAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const isLoading = authLoading || profileLoading;

  // Enhanced admin access check
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const hasAdminAccess = isAdmin || 
                        hasRole('super_admin') || 
                        hasRole('admin') || 
                        hasRole('category_manager') || 
                        hasRole('social_media_manager') || 
                        hasRole('partner_manager') || 
                        hasRole('cfo');
  
  // Debug logging
  useEffect(() => {
    if (!isLoading) {
      console.log('🏛️ AdminDashboard State:', {
        isAuthenticated,
        userEmail,
        isAdmin,
        hasAdminAccess,
        userRole,
        profileRole: profile?.role
      });
      
      adminLog('AdminDashboard', 'Access Check Complete', DebugLevel.INFO, { 
        isAuthenticated,
        hasAdminAccess,
        userRole
      });
    }
  }, [isLoading, isAuthenticated, hasAdminAccess, userRole, profile, userEmail, isAdmin]);

  // Handle access control
  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasAdminAccess) {
      console.log('🚫 Access denied, redirecting to homepage');
      toast({
        title: "Access Denied",
        description: `You don't have admin privileges. Current role: ${userRole}`,
        variant: "destructive",
      });
      navigate('/', { replace: true });
    }
  }, [isLoading, isAuthenticated, hasAdminAccess, navigate, toast, userRole]);

  const showDebugInfo = () => {
    const info = {
      user: user ? {
        id: user.id,
        email: userEmail,
        role: userRole
      } : null,
      profile: profile ? {
        id: profile.id,
        role: profile.role,
        email: profile.email
      } : null,
      access: {
        isAdmin,
        hasAdminAccess,
        isAuthenticated,
        isLoading
      }
    };
    setDebugInfo(JSON.stringify(info, null, 2));
    console.log('🔍 Debug Info:', info);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-puzzle-black p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
      </div>
    );
  }

  // Show access denied if not authenticated or no admin access
  if (!isAuthenticated || !hasAdminAccess) {
    return (
      <AdminAccessCheck 
        user={user}
        userRole={userRole}
        hasRole={hasRole}
        profile={profile}
      />
    );
  }

  // Show admin dashboard
  return (
    <AdminErrorBoundary>
      <div className="min-h-screen bg-puzzle-black p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-3xl font-game text-puzzle-aqua">
            {userRole === 'super_admin' ? 'Super Admin Dashboard' : 
             userRole === 'admin' ? 'Admin Dashboard' : 
             `${userRole?.replace('_', ' ')} Dashboard`}
          </h1>

          <AdminToolbar showDebugInfo={showDebugInfo} />
          
          {debugInfo && (
            <pre className="mt-4 p-4 bg-black/30 text-white rounded-md overflow-x-auto text-xs">
              {debugInfo}
            </pre>
          )}

          <RoleBasedDashboard />
        </div>
      </div>
    </AdminErrorBoundary>
  );
};

export default AdminDashboard;
