
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { RoleBasedDashboard } from '@/components/admin/RoleBasedDashboard';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { AdminAccessCheck } from '@/components/admin/dashboard/AdminAccessCheck';
import { AdminToolbar } from '@/components/admin/dashboard/AdminToolbar';
import { adminLog, DebugLevel } from '@/utils/debug';

const AdminDashboard = () => {
  const { profile, isLoading } = useUserProfile();
  const { user, hasRole, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Check admin access based on role, not hardcoded emails
  const isSuperAdmin = hasRole('super_admin');
  const isAdmin = hasRole('admin');
  const hasAdminAccess = isSuperAdmin || isAdmin || hasRole('category_manager') || 
                        hasRole('social_media_manager') || hasRole('partner_manager') || hasRole('cfo');
  
  useEffect(() => {
    if (isLoading) return;
    
    adminLog('AdminDashboard', 'Access Check', DebugLevel.INFO, { 
      isLoggedIn: !!user,
      userEmail: user?.email,
      isSuperAdmin,
      isAdmin,
      hasAdminAccess,
      profileRole: profile?.role
    });

    // Check access for users
    if (!hasAdminAccess && user) {
      adminLog('AdminDashboard', 'Access denied, redirecting to homepage', DebugLevel.WARN);
      toast({
        title: "Access Denied",
        description: `You don't have admin privileges. Current role: ${profile?.role || 'unknown'}`,
        variant: "destructive",
      });
      navigate('/', { replace: true });
    }
  }, [isLoading, hasAdminAccess, navigate, profile, user, toast, isSuperAdmin, isAdmin, hasRole]);

  const showDebugInfo = () => {
    const info = {
      user: user ? {
        id: user.id,
        email: user.email,
        role: userRole
      } : null,
      profile: profile ? {
        id: profile.id,
        role: profile.role,
        email: profile.email || profile.id
      } : null,
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
            {isSuperAdmin ? 'Super Admin Dashboard' : 
             isAdmin ? 'Admin Dashboard' : 
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
