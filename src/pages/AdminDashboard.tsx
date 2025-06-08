
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { RoleBasedDashboard } from '@/components/admin/RoleBasedDashboard';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import { useClerkAuth } from '@/hooks/useClerkAuth';
import { AdminAccessCheck } from '@/components/admin/dashboard/AdminAccessCheck';
import { AdminToolbar } from '@/components/admin/dashboard/AdminToolbar';
import { adminLog, DebugLevel } from '@/utils/debug';

const AdminDashboard = () => {
  const { profile, isLoading } = useUserProfile();
  const { user, hasRole, userRole, isAdmin, isAuthenticated } = useClerkAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Enhanced admin access check with multiple fallbacks
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isAdminEmail = userEmail === 'alan@insight-ai-systems.com' || 
                     userEmail === 'alantbooth@xtra.co.nz' ||
                     userEmail === 'rob.small.1234@gmail.com';
  
  // Multiple ways to determine admin access
  const hasAdminAccess = isAdmin || 
                        isAdminEmail || 
                        hasRole('super_admin') || 
                        hasRole('admin') || 
                        hasRole('category_manager') || 
                        hasRole('social_media_manager') || 
                        hasRole('partner_manager') || 
                        hasRole('cfo') ||
                        profile?.role === 'super_admin' ||
                        profile?.role === 'admin';
  
  // Debug logging
  useEffect(() => {
    console.log('🏛️ AdminDashboard Debug:', {
      isLoading,
      isAuthenticated,
      userEmail,
      isAdminEmail,
      isAdmin,
      hasAdminAccess,
      profileRole: profile?.role,
      userRole,
      user: user ? { id: user.id, email: userEmail } : null
    });
    
    adminLog('AdminDashboard', 'Access Check', DebugLevel.INFO, { 
      isLoggedIn: !!user,
      userEmail,
      isAdminEmail,
      isAdmin,
      hasAdminAccess,
      profileRole: profile?.role,
      userRole
    });
  }, [isLoading, isAuthenticated, userEmail, isAdminEmail, isAdmin, hasAdminAccess, profile, user, userRole]);

  useEffect(() => {
    if (isLoading) return;
    
    // Only redirect if user is authenticated but doesn't have admin access
    if (isAuthenticated && !hasAdminAccess && !isLoading) {
      console.log('🚫 Access denied, redirecting to homepage');
      adminLog('AdminDashboard', 'Access denied, redirecting to homepage', DebugLevel.WARN);
      toast({
        title: "Access Denied",
        description: `You don't have admin privileges. Current role: ${profile?.role || userRole || 'unknown'}`,
        variant: "destructive",
      });
      navigate('/', { replace: true });
    }
  }, [isLoading, isAuthenticated, hasAdminAccess, navigate, profile, user, toast, userRole]);

  const showDebugInfo = () => {
    const info = {
      user: user ? {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        role: userRole
      } : null,
      profile: profile ? {
        id: profile.id,
        role: profile.role,
        email: profile.email || profile.id
      } : null,
      access: {
        isAdminEmail,
        isAdmin,
        hasAdminAccess,
        isAuthenticated,
        isLoading
      },
      checks: {
        hasRoleAdmin: hasRole('admin'),
        hasRoleSuperAdmin: hasRole('super_admin'),
        hasRoleCategoryManager: hasRole('category_manager')
      }
    };
    setDebugInfo(JSON.stringify(info, null, 2));
    console.log('🔍 Admin Dashboard Debug Info:', info);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-puzzle-black p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
      </div>
    );
  }

  // Show access denied only if user is authenticated but lacks admin access
  if (isAuthenticated && !hasAdminAccess && !isLoading) {
    return (
      <AdminAccessCheck 
        user={user}
        userRole={userRole}
        hasRole={hasRole}
        profile={profile}
      />
    );
  }

  // Show admin dashboard if user has admin access
  if (hasAdminAccess) {
    return (
      <div className="min-h-screen bg-puzzle-black p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-3xl font-game text-puzzle-aqua">
            {isAdminEmail || userRole === 'super_admin' ? 'Super Admin Dashboard' : 
             userRole === 'admin' ? 'Admin Dashboard' : 
             `${profile?.role?.replace('_', ' ')} Dashboard`}
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
    );
  }

  // Show loading state if we're still determining access
  return (
    <div className="min-h-screen bg-puzzle-black p-6 flex items-center justify-center">
      <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
    </div>
  );
};

export default AdminDashboard;
