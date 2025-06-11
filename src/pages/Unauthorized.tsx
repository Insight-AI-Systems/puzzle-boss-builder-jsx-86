
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useClerkAuth } from '@/hooks/useClerkAuth';

const Unauthorized: React.FC = () => {
  const { userRole } = useClerkAuth();

  return (
    <div className="min-h-screen bg-puzzle-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-puzzle-gray border-puzzle-border">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Shield className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-puzzle-white">Access Denied</CardTitle>
          <CardDescription className="text-puzzle-white/70">
            You don't have permission to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-sm text-puzzle-white/60">
            <p>Your current role: <span className="font-semibold text-puzzle-aqua">{userRole}</span></p>
            <p className="mt-2">
              Contact an administrator if you believe this is an error.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              className="flex-1 border-puzzle-border text-puzzle-white hover:bg-puzzle-white/10"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button 
              asChild 
              className="flex-1 bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90"
            >
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unauthorized;
