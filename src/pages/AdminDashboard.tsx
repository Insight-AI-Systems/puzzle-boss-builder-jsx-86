
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { RoleBasedDashboard } from '@/components/admin/RoleBasedDashboard';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import { useClerkAuth } from '@/hooks/useClerkAuth';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { AdminAccessCheck } from '@/components/admin/dashboard/AdminAccessCheck';
import { AdminToolbar } from '@/components/admin/dashboard/AdminToolbar';
import { AdminErrorBoundary } from '@/components/admin/ErrorBoundary';
import { AdminDebugInfo } from '@/components/admin/AdminDebugInfo';
import { AdminRoleDebug } from '@/components/admin/AdminRoleDebug';
import { adminLog, DebugLevel } from '@/utils/debug';

const AdminDashboard = () => {
  const { profile, isLoading: profileLoading } = useUserProfile();
  const clerkAuth = useClerkAuth();
  const contextAuth = useAuth();
  const { canAccessAdminDashboard, userRole } = usePermissions();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDebug, setShowDebug] = useState(false);
  const [showRoleDebug, setShowRoleDebug] = useState(false);

  const isLoading = clerkAuth.isLoading || profileLoading;
  const userEmail = clerkAuth.user?.primaryEmailAddress?.emailAddress;
  const hasAdminAccess = canAccessAdminDashboard();

  // Show role debug panel for key users or when there are role issues
  const shouldShowRoleDebug = userEmail === 'alan@insight-ai-systems.com' || 
                              userEmail === 'alantbooth@xtra.co.nz' ||
                              (userEmail === 'alan@insight-ai-systems.com' && userRole !== 'super_admin');

  console.log('🏛️ AdminDashboard Comprehensive State:', {
    isAuthenticated: clerkAuth.isAuthenticated,
    userEmail,
    userRole,
    hasAdminAccess,
    canAccessAdminDashboard: canAccessAdminDashboard(),
    isLoading,
    shouldShowRoleDebug,
    profileRole: profile?.role,
    clerkRole: clerkAuth.userRole
  });
  
  // Debug logging
  useEffect(() => {
    if (!isLoading) {
      console.log('🏛️ AdminDashboard Final State:', {
        isAuthenticated: clerkAuth.isAuthenticated,
        userEmail,
        userRole,
        hasAdminAccess,
        roleSource: 'database_only'
      });
      
      adminLog('AdminDashboard', 'Access Check Complete', DebugLevel.INFO, { 
        isAuthenticated: clerkAuth.isAuthenticated,
        hasAdminAccess,
        userRole,
        roleSource: 'database_only'
      });
    }
  }, [isLoading, clerkAuth.isAuthenticated, hasAdminAccess, userRole, userEmail]);

  // Handle access control with enhanced logging
  useEffect(() => {
    if (!isLoading) {
      console.log('🚦 Access Control Check (Database Role Only):', {
        isAuthenticated: clerkAuth.isAuthenticated,
        hasAdminAccess,
        shouldRedirect: clerkAuth.isAuthenticated && !hasAdminAccess
      });

      if (clerkAuth.isAuthenticated && !hasAdminAccess) {
        console.log('🚫 Access denied, redirecting to homepage');
        toast({
          title: "Access Denied",
          description: `You don't have admin privileges. Current role: ${userRole}`,
          variant: "destructive",
        });
        navigate('/', { replace: true });
      }
    }
  }, [isLoading, clerkAuth.isAuthenticated, hasAdminAccess, navigate, toast, userRole]);

  const showDebugInfo = () => {
    setShowDebug(!showDebug);
  };

  const showRoleDebugPanel = () => {
    setShowRoleDebug(!showRoleDebug);
  };

  if (isLoading) {
    console.log('🔄 AdminDashboard Loading...');
    return (
      <div className="min-h-screen bg-puzzle-black p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
      </div>
    );
  }

  // Show access denied if not authenticated or no admin access
  if (!clerkAuth.isAuthenticated || !hasAdminAccess) {
    console.log('🚫 Showing access denied screen');
    return (
      <AdminAccessCheck 
        user={clerkAuth.user}
        userRole={userRole}
        hasRole={clerkAuth.hasRole}
        profile={profile}
      />
    );
  }

  console.log('✅ Showing admin dashboard for user:', userEmail, 'with role:', userRole);
  
  // Show admin dashboard
  return (
    <AdminErrorBoundary>
      <div className="min-h-screen bg-puzzle-black p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <AdminToolbar showDebugInfo={showDebugInfo} />
          
          {/* Role Debug Panel - Always show for key users */}
          {shouldShowRoleDebug && (
            <div className="space-y-4">
              <AdminRoleDebug />
            </div>
          )}

          {showDebug && <AdminDebugInfo />}

          <RoleBasedDashboard />
        </div>
      </div>
    </AdminErrorBoundary>
  );
};

export default AdminDashboard;
