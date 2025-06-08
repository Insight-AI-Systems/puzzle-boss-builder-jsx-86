
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
  const { user, hasRole, userRole, isAdmin } = useClerkAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Enhanced admin access check
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isAdminEmail = userEmail === 'alan@insight-ai-systems.com' || 
                     userEmail === 'alantbooth@xtra.co.nz' ||
                     userEmail === 'rob.small.1234@gmail.com';
  
  const hasAdminAccess = isAdmin || isAdminEmail || hasRole('super_admin') || hasRole('admin') || 
                        hasRole('category_manager') || hasRole('social_media_manager') || 
                        hasRole('partner_manager') || hasRole('cfo');
  
  useEffect(() => {
    if (isLoading) return;
    
    adminLog('AdminDashboard', 'Access Check', DebugLevel.INFO, { 
      isLoggedIn: !!user,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      isAdminEmail,
      isAdmin,
      hasAdminAccess,
      profileRole: profile?.role,
      userRole
    });

    // Don't redirect if user has admin access
    if (!hasAdminAccess && user && !isLoading) {
      adminLog('AdminDashboard', 'Access denied, redirecting to homepage', DebugLevel.WARN);
      toast({
        title: "Access Denied",
        description: `You don't have admin privileges. Current role: ${profile?.role || userRole || 'unknown'}`,
        variant: "destructive",
      });
      navigate('/', { replace: true });
    }
  }, [isLoading, hasAdminAccess, navigate, profile, user, toast, isAdmin, hasRole, userRole, isAdminEmail]);

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
        hasAdminAccess
      }
    };
    setDebugInfo(JSON.stringify(info, null, 2));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-puzzle-black p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
      </div>
    );
  }

  if (user && !hasAdminAccess && !isLoading) {
    return (
      <AdminAccessCheck 
        user={user}
        userRole={userRole}
        hasRole={hasRole}
        profile={profile}
      />
    );
  }

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

  return null;
};

export default AdminDashboard;
