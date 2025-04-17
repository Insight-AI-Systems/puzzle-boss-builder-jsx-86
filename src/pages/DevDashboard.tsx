
import React, { useEffect } from 'react';
import DevelopmentDashboard from '@/components/DevelopmentDashboard';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';

const DevDashboardPage: React.FC = () => {
  const { currentUserId, isLoading } = useUserProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect to auth page if not authenticated
  useEffect(() => {
    if (!isLoading && !currentUserId) {
      console.log('Not authenticated, redirecting to auth page');
      toast({
        title: "Authentication Required",
        description: "Please log in to access the development dashboard.",
        variant: "destructive",
      });
      navigate('/auth', { replace: true });
    }
  }, [currentUserId, isLoading, navigate, toast]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
        </div>
      </>
    );
  }

  // Only render dashboard if authenticated
  if (!currentUserId) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-[calc(100vh-64px)]">
          <p className="text-center">Please log in to access the development dashboard.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Development Dashboard</h1>
        <DevelopmentDashboard />
      </div>
    </>
  );
};

export default DevDashboardPage;
