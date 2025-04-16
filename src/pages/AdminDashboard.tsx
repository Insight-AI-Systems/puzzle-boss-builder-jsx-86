
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RoleBasedDashboard } from '@/components/admin/RoleBasedDashboard';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';

const AdminDashboard = () => {
  const { profile, isLoading, isAdmin, currentUserId } = useUserProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [accessChecked, setAccessChecked] = useState(false);

  useEffect(() => {
    // More verbose debug logging
    console.log('Admin Dashboard - Auth State:', { 
      isLoading, 
      isLoggedIn: !!currentUserId,
      profile, 
      isAdmin,
      role: profile?.role
    });
    
    // Force update the access check after a delay to ensure everything is loaded
    const timer = setTimeout(() => {
      // Only redirect if user is not admin and we have a currentUserId (meaning they're logged in)
      if (!isLoading) {
        if (!isAdmin && currentUserId) {
          toast({
            title: "Access Denied",
            description: `You don't have admin privileges. Current role: ${profile?.role || 'unknown'}`,
            variant: "destructive",
          });
          navigate('/', { replace: true });
        } else if (isAdmin) {
          toast({
            title: "Admin Access Granted",
            description: `Welcome to the Admin Dashboard. Your role: ${profile?.role}`,
          });
        }
        setAccessChecked(true);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [isLoading, isAdmin, navigate, profile, currentUserId, toast]);

  // If user is explicitly super_admin, force isAdmin to true
  useEffect(() => {
    if (profile?.role === 'super_admin' && !isAdmin) {
      console.log('Force granting admin access to super_admin user');
      setAccessChecked(true);
    }
  }, [profile, isAdmin]);

  // Force entry for super_admin regardless of isAdmin flag
  if (profile?.role === 'super_admin') {
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

  if (isLoading || !accessChecked) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-puzzle-black p-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
        </div>
      </>
    );
  }

  // If they're not an admin and not loading, they'll be redirected
  if (!isAdmin) {
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
  }

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
};

export default AdminDashboard;
