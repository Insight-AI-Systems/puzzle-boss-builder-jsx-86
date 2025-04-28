
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { AdminAuthForm } from '@/components/admin/AdminAuthForm';
import { PuzzleAdminPanel } from '@/components/admin/PuzzleAdminPanel';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Check for existing authentication in localStorage
  useEffect(() => {
    const authStatus = localStorage.getItem('admin-auth');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  const handleLogin = (password: string) => {
    // Simple password check - in a real app, this would be much more secure
    if (password === 'admin123') {
      localStorage.setItem('admin-auth', 'true');
      setIsAuthenticated(true);
      toast({
        title: 'Authentication successful',
        description: 'Welcome to the admin panel',
      });
    } else {
      toast({
        title: 'Authentication failed',
        description: 'Incorrect password',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-auth');
    setIsAuthenticated(false);
    toast({
      title: 'Logged out',
      description: 'You have been logged out of the admin panel',
    });
  };

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-puzzle-aqua">Admin Panel</h1>
          {isAuthenticated && (
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </div>
        {isAuthenticated && (
          <p className="text-muted-foreground mt-2">
            Manage puzzle settings and assets
          </p>
        )}
      </header>

      {!isAuthenticated ? (
        <AdminAuthForm onLogin={handleLogin} />
      ) : (
        <PuzzleAdminPanel />
      )}
    </div>
  );
};

export default AdminPanel;
