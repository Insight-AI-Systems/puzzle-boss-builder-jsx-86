
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
import { adminLog, DebugLevel } from '@/utils/debug';
import Navbar from '@/components/Navbar';

const AdminDashboard = () => {
  const { isSignedIn, isLoaded, userRole, canAccessAdminDashboard, userId } = useClerkRoles();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDebug, setShowDebug] = useState(false);

  const hasAdminAccess = canAccessAdminDashboard();

  console.log('🏛️ AdminDashboard Clerk RBAC State:', {
    isSignedIn,
    userId,
    userRole,
    hasAdminAccess,
    isLoaded,
    cleanedRole: userRole // This should now be just "super_admin" not "org:super_admin"
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

  // Handle access control - remove the redirect that's causing the reload loop
  useEffect(() => {
    if (isLoaded && isSignedIn && !hasAdminAccess) {
      console.log('🚫 Access denied - showing access check component instead of redirecting');
      toast({
        title: "Access Denied",
        description: `You don't have admin privileges. Current role: ${userRole}`,
        variant: "destructive",
      });
      // Don't navigate away - just show the access denied component
    }
  }, [isLoaded, isSignedIn, hasAdminAccess, toast, userRole]);

  const showDebugInfo = () => {
    setShowDebug(!showDebug);
  };

  if (!isLoaded) {
    console.log('🔄 AdminDashboard Loading...');
    return (
      <div className="min-h-screen bg-puzzle-black">
        <Navbar />
        <div className="p-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
        </div>
      </div>
    );
  }

  // Show access denied if not authenticated or no admin access
  if (!isSignedIn || !hasAdminAccess) {
    console.log('🚫 Showing access denied screen for role:', userRole);
    return (
      <div className="min-h-screen bg-puzzle-black">
        <Navbar />
        <AdminAccessCheck 
          userId={userId}
          userRole={userRole}
          hasAdminAccess={hasAdminAccess}
        />
      </div>
    );
  }

  console.log('✅ Showing admin dashboard for user:', userId, 'with role:', userRole);
  
  // Show admin dashboard with navbar
  return (
    <AdminErrorBoundary>
      <div className="min-h-screen bg-puzzle-black">
        <Navbar />
        <div className="p-6">
          <div className="max-w-6xl mx-auto space-y-8">
            <AdminToolbar showDebugInfo={showDebugInfo} />

            {showDebug && <AdminDebugInfo />}

            <RoleBasedDashboard />
          </div>
        </div>
      </div>
    </AdminErrorBoundary>
  );
};

export default AdminDashboard;
