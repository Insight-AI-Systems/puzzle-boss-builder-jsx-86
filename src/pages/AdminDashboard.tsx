
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RoleBasedDashboard } from '@/components/admin/RoleBasedDashboard';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';

// Important protected emails that should always have super_admin access
const PROTECTED_SUPER_ADMINS = ['alan@insight-ai-systems'];

const AdminDashboard = () => {
  const { profile, isLoading, isAdmin, currentUserId } = useUserProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [accessChecked, setAccessChecked] = useState(false);

  // Special super_admin handling 
  const isSuperAdmin = profile?.role === 'super_admin' || 
                      (profile?.id && PROTECTED_SUPER_ADMINS.includes(profile.id));

  // Consolidated useEffect for access checks and logging
  useEffect(() => {
    if (isLoading) return;
    
    console.log('Admin Dashboard - Auth State:', { 
      isLoggedIn: !!currentUserId,
      profile, 
      isAdmin,
      isSuperAdmin,
      role: profile?.role,
      userId: profile?.id
    });
    
    // Force grant access to protected super admins
    if (profile?.id && PROTECTED_SUPER_ADMINS.includes(profile.id)) {
      console.log('Protected super admin detected, access granted');
      toast({
        title: "Super Admin Access Granted",
        description: "Welcome to the Admin Dashboard",
      });
      setAccessChecked(true);
      return;
    }
    
    // Check access for regular users
    if (!isAdmin && !isSuperAdmin && currentUserId) {
      console.log('Access denied, redirecting to home');
      toast({
        title: "Access Denied",
        description: `You don't have admin privileges. Current role: ${profile?.role || 'unknown'}`,
        variant: "destructive",
      });
      navigate('/', { replace: true });
    } else if (isAdmin || isSuperAdmin) {
      console.log('Admin access granted');
      toast({
        title: "Admin Access Granted",
        description: `Welcome to the Admin Dashboard. Your role: ${profile?.role}`,
      });
    }
    setAccessChecked(true);
  }, [isLoading, isAdmin, isSuperAdmin, navigate, profile, currentUserId, toast]);

  // Loading state
  if (isLoading || (!accessChecked && !isSuperAdmin)) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-puzzle-black p-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
        </div>
      </>
    );
  }

  // Super admin access is always permitted
  if (isSuperAdmin) {
    console.log('Rendering super admin dashboard');
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-puzzle-black p-6">
          <div className="max-w-6xl mx-auto space-y-8">
            <h1 className="text-3xl font-game text-puzzle-aqua">Super Admin Dashboard</h1>
            <RoleBasedDashboard />
          </div>
        </div>
      </>
    );
  }

  // Regular admin dashboard
  if (isAdmin) {
    console.log('Rendering regular admin dashboard');
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-puzzle-black p-6">
          <div className="max-w-6xl mx-auto space-y-8">
            <h1 className="text-3xl font-game text-puzzle-aqua">Admin Dashboard</h1>
            <RoleBasedDashboard />
          </div>
        </div>
      </>
    );
  }

  // Access denied case (fallback)
  console.log('Rendering access denied screen');
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-puzzle-black p-6">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to access the admin dashboard.
            {profile && (
              <p className="mt-2">Your current role: {profile.role}</p>
            )}
          </AlertDescription>
        </Alert>
      </div>
    </>
  );
};

export default AdminDashboard;
