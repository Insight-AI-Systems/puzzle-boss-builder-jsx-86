
import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface AuthButtonsProps {
  isMobile?: boolean;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ isMobile = false }) => {
  const { isAuthenticated } = useAuth();
  
  // Don't show auth buttons if already authenticated
  if (isAuthenticated) {
    return null;
  }
  
  if (isMobile) {
    return (
      <Button variant="ghost" className="mr-2 text-muted-foreground" asChild>
        <Link to="/auth">
          <LogIn className="h-5 w-5" />
        </Link>
      </Button>
    );
  }
  
  return (
    <>
      <Button variant="ghost" className="text-muted-foreground hover:text-puzzle-white" asChild>
        <Link to="/auth">Sign In</Link>
      </Button>
      <Button className="bg-puzzle-aqua hover:bg-puzzle-aqua/80" asChild>
        <Link to="/auth?signup=true">Sign Up</Link>
      </Button>
    </>
  );
};

export default AuthButtons;
