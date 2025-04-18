
import React from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfileForm } from '@/components/profile/UserProfileForm';
import { UserManagement } from '@/components/admin/UserManagement';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Loader2, UserCog, User, ShieldAlert, LayoutDashboard } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const { isAdmin, isLoading } = useUserProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-puzzle-black p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-puzzle-black text-white">
      <div className="container mx-auto p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-game text-puzzle-aqua">User Profile</h1>
            
            {isAdmin && (
              <Link to="/admin-dashboard">
                <Button variant="outline" className="border-puzzle-aqua/50 hover:bg-puzzle-aqua/10">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Admin Dashboard
                </Button>
              </Link>
            )}
          </div>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="bg-puzzle-black/50 border border-puzzle-aqua/20">
              <TabsTrigger value="profile" className="data-[state=active]:bg-puzzle-aqua/10">
                <User className="h-4 w-4 mr-2" />
                My Profile
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="users" className="data-[state=active]:bg-puzzle-aqua/10">
                  <UserCog className="h-4 w-4 mr-2" />
                  User Management
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="profile" className="pt-4">
              <UserProfileForm />
            </TabsContent>
            
            {isAdmin && (
              <TabsContent value="users" className="pt-4">
                <Alert className="mb-6 bg-amber-900/30 border-amber-500">
                  <ShieldAlert className="h-4 w-4" />
                  <AlertTitle>Admin Access</AlertTitle>
                  <AlertDescription>
                    You have administrative privileges. Be careful when modifying user roles and permissions.
                  </AlertDescription>
                </Alert>
                <UserManagement />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
