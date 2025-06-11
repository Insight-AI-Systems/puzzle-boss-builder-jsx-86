
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { RoleBasedDashboard } from '@/components/admin/RoleBasedDashboard';
import { useToast } from '@/hooks/use-toast';
import { useClerkRoles } from '@/hooks/useClerkRoles';
import { AdminAccessCheck } from '@/components/admin/dashboard/AdminAccessCheck';
import { AdminToolbar } from '@/components/admin/dashboard/AdminToolbar';
import { AdminErrorBoundary } from '@/components/admin/ErrorBoundary';
import { AdminDebugInfo } from '@/components/admin/AdminDebugInfo';
import { ClerkRoleDebug } from '@/components/admin/ClerkRoleDebug';
import { adminLog, DebugLevel } from '@/utils/debug';

const AdminDashboard = () => {
  const { isSignedIn, isLoaded, userRole, canAccessAdminDashboard, userId } = useClerkRoles();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDebug, setShowDebug] = useState(false);
  const [showRoleDebug, setShowRoleDebug] = useState(false);

  const hasAdminAccess = canAccessAdminDashboard();

  console.log('🏛️ AdminDashboard Clerk RBAC State:', {
    isSignedIn,
    userId,
    userRole,
    hasAdminAccess,
    isLoaded
  });
  
  // Debug logging
  useEffect(() => {
    if (isLoaded) {
      console.log('🏛️ AdminDashboard Final State (Clerk RBAC):', {
        isSignedIn,
        userId,
        userRole,
        hasAdminAccess,
        roleSource: 'clerk_rbac'
      });
      
      adminLog('AdminDashboard', 'Access Check Complete (Clerk RBAC)', DebugLevel.INFO, { 
        isSignedIn,
        hasAdminAccess,
        userRole,
        roleSource: 'clerk_rbac'
      });
    }
  }, [isLoaded, isSignedIn, hasAdminAccess, userRole, userId]);

  // Handle access control
  useEffect(() => {
    if (isLoaded) {
      console.log('🚦 Access Control Check (Clerk RBAC):', {
        isSignedIn,
        hasAdminAccess,
        shouldRedirect: isSignedIn && !hasAdminAccess
      });

      if (isSignedIn && !hasAdminAccess) {
        console.log('🚫 Access denied, redirecting to homepage');
        toast({
          title: "Access Denied",
          description: `You don't have admin privileges. Current role: ${userRole}`,
          variant: "destructive",
        });
        navigate('/', { replace: true });
      }
    }
  }, [isLoaded, isSignedIn, hasAdminAccess, navigate, toast, userRole]);

  const showDebugInfo = () => {
    setShowDebug(!showDebug);
  };

  const showRoleDebugPanel = () => {
    setShowRoleDebug(!showRoleDebug);
  };

  if (!isLoaded) {
    console.log('🔄 AdminDashboard Loading...');
    return (
      <div className="min-h-screen bg-puzzle-black p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
      </div>
    );
  }

  // Show access denied if not authenticated or no admin access
  if (!isSignedIn || !hasAdminAccess) {
    console.log('🚫 Showing access denied screen');
    return (
      <AdminAccessCheck 
        userId={userId}
        userRole={userRole}
        hasAdminAccess={hasAdminAccess}
      />
    );
  }

  console.log('✅ Showing admin dashboard for user:', userId, 'with role:', userRole);
  
  // Show admin dashboard
  return (
    <AdminErrorBoundary>
      <div className="min-h-screen bg-puzzle-black p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <AdminToolbar showDebugInfo={showDebugInfo} />
          
          {/* Clerk Role Debug Panel */}
          <div className="space-y-4">
            <ClerkRoleDebug />
          </div>

          {showDebug && <AdminDebugInfo />}

          <RoleBasedDashboard />
        </div>
      </div>
    </AdminErrorBoundary>
  );
};

export default AdminDashboard;
