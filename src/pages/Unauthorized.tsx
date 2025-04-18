
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Unauthorized: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-puzzle-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-red-900/30 flex items-center justify-center">
          <Shield className="h-8 w-8 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-puzzle-aqua">Access Denied</h1>
        
        <p className="text-lg">
          {user ? (
            <>Your account doesn't have permission to access this page.</>
          ) : (
            <>You need to be logged in with appropriate permissions to access this page.</>
          )}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button asChild variant="outline" className="border-puzzle-aqua/30">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
          
          {!user && (
            <Button asChild className="bg-puzzle-aqua hover:bg-puzzle-aqua/80">
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
