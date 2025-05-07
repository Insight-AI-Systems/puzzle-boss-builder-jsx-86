
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { RoleBasedDashboard } from '@/components/admin/RoleBasedDashboard';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { AdminAccessCheck } from '@/components/admin/dashboard/AdminAccessCheck';
import { AdminToolbar } from '@/components/admin/dashboard/AdminToolbar';
import { AdminDiagnostics } from '@/components/admin/AdminDiagnostics';
import { PROTECTED_ADMIN_EMAIL, isProtectedAdmin } from '@/constants/securityConfig';

const AdminDashboard = () => {
  const { profile, isLoading } = useUserProfile();
  const { user, hasRole, userRole, session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // Comprehensive admin access check
  const hasProtectedEmail = isProtectedAdmin(user?.email);
  const isSuperAdmin = hasProtectedEmail || hasRole('super_admin');
  const isAdmin = isSuperAdmin || hasRole('admin');
  const isCategoryManager = hasRole('category_manager');
  const isSocialMediaManager = hasRole('social_media_manager');
  const isPartnerManager = hasRole('partner_manager');
  const isCfo = hasRole('cfo');
  
  // Combined check for any admin-related role
  const hasAdminAccess = isAdmin || isCategoryManager || isSocialMediaManager || isPartnerManager || isCfo;
  
  useEffect(() => {
    if (isLoading) return;
    
    console.log('AdminDashboard - Access Check:', { 
      isLoggedIn: !!user,
      userEmail: user?.email,
      hasProtectedEmail,
      isAdmin,
      isSuperAdmin,
      isCategoryManager,
      isSocialMediaManager,
      isPartnerManager,
      isCfo,
      hasAdminAccess,
      profileRole: profile?.role,
      sessionExists: !!session
    });

    // Special case for protected admin - always grant access
    if (hasProtectedEmail) {
      console.log('AdminDashboard - Protected admin detected, granting full access');
      return;
    }
    
    // Check access for regular users
    if (!hasAdminAccess && user) {
      console.log('AdminDashboard - Access denied, redirecting to homepage');
      toast({
        title: "Access Denied",
        description: `You don't have admin privileges. Current role: ${profile?.role || 'unknown'}`,
        variant: "destructive",
      });
      navigate('/', { replace: true });
    }
  }, [isLoading, hasAdminAccess, isSuperAdmin, navigate, profile, user, toast, hasProtectedEmail, session]);

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
      session: session ? {
        exists: true,
        userId: session.user.id,
      } : null,
      hasRoles: {
        admin: hasRole('admin'),
        superAdmin: hasRole('super_admin'),
        categoryManager: hasRole('category_manager'),
        socialMediaManager: hasRole('social_media_manager'),
        partnerManager: hasRole('partner_manager'),
        cfo: hasRole('cfo')
      },
      hasProtectedEmail,
      hasAdminAccess
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

  if (user && !hasAdminAccess && !hasProtectedEmail && !isLoading) {
    return (
      <AdminAccessCheck 
        user={user}
        userRole={userRole}
        hasRole={hasRole}
        profile={profile}
      />
    );
  }

  if (hasAdminAccess || hasProtectedEmail) {
    return (
      <div className="min-h-screen bg-puzzle-black p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-3xl font-game text-puzzle-aqua">
            {hasProtectedEmail || isSuperAdmin ? 'Admin Dashboard' : `${profile?.role?.replace('_', ' ')} Dashboard`}
          </h1>

          <AdminToolbar 
            showDebugInfo={showDebugInfo}
            showDiagnostics={() => setShowDiagnostics(!showDiagnostics)}
          />
          
          {debugInfo && (
            <pre className="mt-4 p-4 bg-black/30 text-white rounded-md overflow-x-auto text-xs">
              {debugInfo}
            </pre>
          )}

          {showDiagnostics && <AdminDiagnostics />}

          <RoleBasedDashboard />
        </div>
      </div>
    );
  }

  return null;
};

export default AdminDashboard;
