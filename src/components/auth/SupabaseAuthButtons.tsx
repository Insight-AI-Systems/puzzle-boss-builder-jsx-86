import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface SupabaseAuthButtonsProps {
  isMobile?: boolean;
}

export const SupabaseAuthButtons: React.FC<SupabaseAuthButtonsProps> = ({ isMobile = false }) => {
  const { isAuthenticated, isLoading } = useAuth();

  console.log('SupabaseAuthButtons state:', { isAuthenticated, isLoading });

  // Show loading state while auth is initializing
  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-pulse bg-gray-300 rounded px-4 py-2 w-20 h-8"></div>
      </div>
    );
  }

  // For authenticated users, don't render auth buttons
  if (isAuthenticated) {
    return null;
  }

  if (isMobile) {
    return (
      <div className="flex items-center space-x-2">
        <Link to="/auth">
          <Button variant="ghost" className="text-muted-foreground">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Link to="/auth">
        <Button variant="ghost" className="text-muted-foreground hover:text-puzzle-white">
          Sign In
        </Button>
      </Link>
      <Link to="/auth?signup=true">
        <Button className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">
          Sign Up
        </Button>
      </Link>
    </div>
  );
};