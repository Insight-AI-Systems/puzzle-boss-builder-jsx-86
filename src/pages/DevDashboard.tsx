
import React, { useEffect } from 'react';
import DevelopmentDashboard from '@/components/DevelopmentDashboard';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const DevDashboardPage: React.FC = () => {
  const { currentUserId, isLoading } = useUserProfile();
  const navigate = useNavigate();

  // Redirect to auth page if not authenticated
  useEffect(() => {
    if (!isLoading && !currentUserId) {
      navigate('/auth', { replace: true });
    }
  }, [currentUserId, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
      </div>
    );
  }

  // Only render dashboard if authenticated
  if (!currentUserId) {
    return null; // This prevents flash of content before redirect happens
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Development Dashboard</h1>
      <DevelopmentDashboard />
    </div>
  );
};

export default DevDashboardPage;
