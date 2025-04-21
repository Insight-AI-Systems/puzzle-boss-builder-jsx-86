
import React, { useEffect } from 'react';
import DevelopmentDashboard from '@/components/DevelopmentDashboard';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
      <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-[calc(100vh-64px)]">
        <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
      </div>
    );
  }

  // Only render dashboard if authenticated
  if (!currentUserId) {
    return (
      <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-[calc(100vh-64px)]">
        <p className="text-center">Please log in to access the development dashboard.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Development Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Button variant="outline" asChild className="h-auto p-6">
          <Link to="/puzzle-tests" className="flex flex-col items-center justify-center">
            <span className="text-lg font-medium mb-2">Puzzle Test Suite</span>
            <span className="text-sm text-muted-foreground text-center">
              Run and monitor puzzle game tests
            </span>
          </Link>
        </Button>
        
        <Button variant="outline" asChild className="h-auto p-6 bg-gradient-to-br from-puzzle-aqua/5 to-puzzle-black/5 border-puzzle-aqua/20">
          <Link to="/puzzle-playground" className="flex flex-col items-center justify-center">
            <span className="text-lg font-medium mb-2 text-puzzle-aqua">Puzzle Test Playground</span>
            <span className="text-sm text-muted-foreground text-center">
              Compare different puzzle engines in a safe environment
            </span>
          </Link>
        </Button>
      </div>
      
      <DevelopmentDashboard />
    </div>
  );
};

export default DevDashboardPage;
