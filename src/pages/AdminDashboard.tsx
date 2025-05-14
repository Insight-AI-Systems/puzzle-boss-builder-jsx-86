
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { RoleBasedDashboard } from '@/components/admin/RoleBasedDashboard';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import { useAuthState } from '@/contexts/auth/AuthStateContext';
import { useRoles } from '@/contexts/auth/RoleContext';
import { AdminAccessCheck } from '@/components/admin/dashboard/AdminAccessCheck';
import { AdminToolbar } from '@/components/admin/dashboard/AdminToolbar';

const AdminDashboard = () => {
  const { profile, isLoading } = useUserProfile();
  const { user } = useAuthState();
  const { userRole, hasRole, isAdmin } = useRoles();
  const { toast } = useToast();
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Check for admin access
  const hasAdminAccess = isAdmin || 
    hasRole('category_manager') || 
    hasRole('social_media_manager') || 
    hasRole('partner_manager') || 
    hasRole('cfo');

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
            {isAdmin ? 'Admin Dashboard' : `${profile?.role?.replace('_', ' ')} Dashboard`}
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
