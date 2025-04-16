
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RoleBasedDashboard } from '@/components/admin/RoleBasedDashboard';
import { useUserProfile } from '@/hooks/useUserProfile';

const AdminDashboard = () => {
  const { profile, isLoading, isAdmin } = useUserProfile();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Redirect non-admin users to the home page
    if (!isLoading && !isAdmin) {
      navigate('/', { replace: true });
    }
  }, [isLoading, isAdmin, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-puzzle-black p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
      </div>
    );
  }

  // If they're not an admin and not loading, they'll be redirected
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-puzzle-black p-6">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to access the admin dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-puzzle-black p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-game text-puzzle-aqua">Admin Dashboard</h1>
        <RoleBasedDashboard />
      </div>
    </div>
  );
};

export default AdminDashboard;
