
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { RoleBasedDashboard } from '@/components/admin/RoleBasedDashboard';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import { useClerkAuth } from '@/hooks/useClerkAuth';
import { useAuth } from '@/contexts/AuthContext';
import { AdminAccessCheck } from '@/components/admin/dashboard/AdminAccessCheck';
import { AdminToolbar } from '@/components/admin/dashboard/AdminToolbar';
import { AdminErrorBoundary } from '@/components/admin/ErrorBoundary';
import { AdminDebugInfo } from '@/components/admin/AdminDebugInfo';
import { adminLog, DebugLevel } from '@/utils/debug';

const AdminDashboard = () => {
  const { profile, isLoading: profileLoading } = useUserProfile();
  const clerkAuth = useClerkAuth();
  const contextAuth = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDebug, setShowDebug] = useState(false);

  const isLoading = clerkAuth.isLoading || profileLoading;

  // Use both auth sources for comprehensive access check
  const userEmail = clerkAuth.user?.primaryEmailAddress?.emailAddress;
  const hasAdminAccess = clerkAuth.isAdmin || 
                        clerkAuth.hasRole('super_admin') || 
                        clerkAuth.hasRole('admin') || 
                        clerkAuth.hasRole('category_manager') || 
                        clerkAuth.hasRole('social_media_manager') || 
                        clerkAuth.hasRole('partner_manager') || 
                        clerkAuth.hasRole('cfo') ||
                        contextAuth.isAdmin ||
                        contextAuth.hasRole('super_admin') ||
                        contextAuth.hasRole('admin');

  console.log('🏛️ AdminDashboard Comprehensive State:', {
    isAuthenticated: clerkAuth.isAuthenticated,
    userEmail,
    clerkAuth: {
      isAdmin: clerkAuth.isAdmin,
      userRole: clerkAuth.userRole,
      hasAdminAccess: clerkAuth.isAdmin || clerkAuth.hasRole('super_admin') || clerkAuth.hasRole('admin')
    },
    contextAuth: {
      isAdmin: contextAuth.isAdmin,
      userRole: contextAuth.userRole,
      hasAdminAccess: contextAuth.isAdmin || contextAuth.hasRole('super_admin') || contextAuth.hasRole('admin')
    },
    finalHasAdminAccess: hasAdminAccess,
    isLoading
  });
  
  // Debug logging
  useEffect(() => {
    if (!isLoading) {
      console.log('🏛️ AdminDashboard Final State:', {
        isAuthenticated: clerkAuth.isAuthenticated,
        userEmail,
        hasAdminAccess,
        userRole: clerkAuth.userRole
      });
      
      adminLog('AdminDashboard', 'Access Check Complete', DebugLevel.INFO, { 
        isAuthenticated: clerkAuth.isAuthenticated,
        hasAdminAccess,
        userRole: clerkAuth.userRole
      });
    }
  }, [isLoading, clerkAuth.isAuthenticated, hasAdminAccess, clerkAuth.userRole, userEmail]);

  // Handle access control with enhanced logging
  useEffect(() => {
    if (!isLoading) {
      console.log('🚦 Access Control Check:', {
        isAuthenticated: clerkAuth.isAuthenticated,
        hasAdminAccess,
        shouldRedirect: clerkAuth.isAuthenticated && !hasAdminAccess
      });

      if (clerkAuth.isAuthenticated && !hasAdminAccess) {
        console.log('🚫 Access denied, redirecting to homepage');
        toast({
          title: "Access Denied",
          description: `You don't have admin privileges. Current role: ${clerkAuth.userRole}`,
          variant: "destructive",
        });
        navigate('/', { replace: true });
      }
    }
  }, [isLoading, clerkAuth.isAuthenticated, hasAdminAccess, navigate, toast, clerkAuth.userRole]);

  const showDebugInfo = () => {
    setShowDebug(!showDebug);
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
        userRole={clerkAuth.userRole}
        hasRole={clerkAuth.hasRole}
        profile={profile}
      />
    );
  }

  console.log('✅ Showing admin dashboard');
  
  // Show admin dashboard
  return (
    <AdminErrorBoundary>
      <div className="min-h-screen bg-puzzle-black p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-3xl font-game text-puzzle-aqua">
            {clerkAuth.userRole === 'super_admin' ? 'Super Admin Dashboard' : 
             clerkAuth.userRole === 'admin' ? 'Admin Dashboard' : 
             `${clerkAuth.userRole?.replace('_', ' ')} Dashboard`}
          </h1>

          <AdminToolbar showDebugInfo={showDebugInfo} />
          
          {showDebug && <AdminDebugInfo />}

          <RoleBasedDashboard />
        </div>
      </div>
    </AdminErrorBoundary>
  );
};

export default AdminDashboard;
