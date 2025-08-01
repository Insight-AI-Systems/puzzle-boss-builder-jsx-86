
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { RoleBasedDashboard } from '@/components/admin/RoleBasedDashboard';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { AdminAccessCheck } from '@/components/admin/dashboard/AdminAccessCheck';
import { AdminToolbar } from '@/components/admin/dashboard/AdminToolbar';
import { AdminErrorBoundary } from '@/components/admin/ErrorBoundary';
import { AdminDebugInfo } from '@/components/admin/AdminDebugInfo';
import { adminLog, DebugLevel } from '@/utils/debug';
import Navbar from '@/components/Navbar';

const AdminDashboard = () => {
  const { isAuthenticated, isLoading, userRole, user } = useAuth();
  const { canAccessAdminDashboard } = usePermissions();
  const userId = user?.id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDebug, setShowDebug] = useState(false);

  const hasAdminAccess = canAccessAdminDashboard();

  console.log('🏛️ AdminDashboard Supabase State:', {
    isAuthenticated,
    userId,
    userRole,
    hasAdminAccess,
    isLoading,
    cleanedRole: userRole
  });
  
  // Debug logging
  useEffect(() => {
    if (!isLoading) {
      console.log('🏛️ AdminDashboard Final State (Supabase):', {
        isAuthenticated,
        userId,
        userRole,
        hasAdminAccess,
        roleSource: 'supabase'
      });
      
      adminLog('AdminDashboard', 'Access Check Complete (Supabase)', DebugLevel.INFO, { 
        isAuthenticated,
        hasAdminAccess,
        userRole,
        roleSource: 'supabase'
      });
    }
  }, [isLoading, isAuthenticated, hasAdminAccess, userRole, userId]);

  // Handle access control
  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasAdminAccess) {
      console.log('🚫 Access denied - showing access check component instead of redirecting');
      toast({
        title: "Access Denied",
        description: `You don't have admin privileges. Current role: ${userRole}`,
        variant: "destructive",
      });
    }
  }, [isLoading, isAuthenticated, hasAdminAccess, toast, userRole]);

  const showDebugInfo = () => {
    setShowDebug(!showDebug);
  };

  if (isLoading) {
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
  if (!isAuthenticated || !hasAdminAccess) {
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
