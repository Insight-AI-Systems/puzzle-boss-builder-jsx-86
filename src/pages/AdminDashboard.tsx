
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { RoleBasedDashboard } from '@/components/admin/RoleBasedDashboard';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { AdminAccessCheck } from '@/components/admin/dashboard/AdminAccessCheck';
import { AdminToolbar } from '@/components/admin/dashboard/AdminToolbar';

// Updated to use the correct admin email
const PROTECTED_ADMIN_EMAIL = 'alantbooth@xtra.co.nz';

const AdminDashboard = () => {
  const { profile, isLoading } = useUserProfile();
  const { user, hasRole, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Simple admin access check using the correct email
  const isProtectedAdmin = user?.email === PROTECTED_ADMIN_EMAIL;
  const isSuperAdmin = isProtectedAdmin || hasRole('super_admin');
  
  useEffect(() => {
    if (isLoading) return;
    
    console.log('AdminDashboard - Access Check:', { 
      isLoggedIn: !!user,
      userEmail: user?.email,
      isProtectedAdmin,
      isSuperAdmin,
      profileRole: profile?.role
    });

    // Special case for protected admin - always grant access
    if (isProtectedAdmin) {
      console.log('AdminDashboard - Protected admin detected, granting full access');
      return;
    }
    
    // Check access for regular users
    if (!isSuperAdmin && !hasRole('category_manager') && !hasRole('social_media_manager') && 
        !hasRole('partner_manager') && !hasRole('cfo') && user) {
      console.log('AdminDashboard - Access denied, redirecting to homepage');
      toast({
        title: "Access Denied",
        description: `You don't have admin privileges. Current role: ${profile?.role || 'unknown'}`,
        variant: "destructive",
      });
      navigate('/', { replace: true });
    }
  }, [isLoading, isSuperAdmin, navigate, profile, user, toast, isProtectedAdmin, hasRole]);

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

  if (user && !isSuperAdmin && 
      !hasRole('category_manager') && 
      !hasRole('social_media_manager') && 
      !hasRole('partner_manager') && 
      !hasRole('cfo') && 
      !isLoading) {
    return (
      <AdminAccessCheck 
        user={user}
        userRole={userRole}
        hasRole={hasRole}
        profile={profile}
      />
    );
  }

  if (isProtectedAdmin || isSuperAdmin || 
      hasRole('category_manager') || 
      hasRole('social_media_manager') || 
      hasRole('partner_manager') || 
      hasRole('cfo')) {
    return (
      <div className="min-h-screen bg-puzzle-black p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-3xl font-game text-puzzle-aqua">
            {isProtectedAdmin || isSuperAdmin ? 'Admin Dashboard' : `${profile?.role?.replace('_', ' ')} Dashboard`}
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
