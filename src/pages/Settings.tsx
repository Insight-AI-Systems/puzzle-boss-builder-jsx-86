
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BellRing, ShieldCheck, UserCog, CreditCard, Globe, ShieldAlert } from 'lucide-react';
import { SecuritySettings } from '@/components/profile/SecuritySettings';
import { SecurityAuditDashboard } from '@/components/profile/SecurityAuditDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Settings = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-puzzle-black flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 text-puzzle-aqua animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-game text-puzzle-aqua text-center mb-6">Account Settings</h1>
      <p className="text-center text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
        Manage your account preferences and security settings
      </p>
      
      <Tabs defaultValue="security" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCog className="h-5 w-5 mr-2 text-puzzle-aqua" />
                Profile Settings
              </CardTitle>
              <CardDescription>
                Manage your public profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This section will contain form controls for updating your display name, profile picture, bio, and other public information.
              </p>
              <div className="h-40 border border-dashed border-puzzle-aqua/30 rounded-md flex items-center justify-center">
                <p className="text-puzzle-aqua/70">Profile Settings Form Placeholder</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4 mt-6">
          <SecuritySettings />
          <SecurityAuditDashboard />
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BellRing className="h-5 w-5 mr-2 text-puzzle-aqua" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Control how and when we contact you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This section will contain toggles and settings for email notifications, push notifications, and other communication preferences.
              </p>
              <div className="h-40 border border-dashed border-puzzle-aqua/30 rounded-md flex items-center justify-center">
                <p className="text-puzzle-aqua/70">Notification Settings Controls Placeholder</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Payment Tab */}
        <TabsContent value="payment" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-puzzle-aqua" />
                Payment Methods
              </CardTitle>
              <CardDescription>
                Manage your payment methods and billing information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This section will display your saved payment methods and allow you to add, edit, or remove payment options.
              </p>
              <div className="h-40 border border-dashed border-puzzle-aqua/30 rounded-md flex items-center justify-center">
                <p className="text-puzzle-aqua/70">Payment Methods Interface Placeholder</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-puzzle-aqua" />
                Site Preferences
              </CardTitle>
              <CardDescription>
                Customize your experience on The Puzzle Boss
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This section will contain language preferences, accessibility settings, and other site-wide preferences.
              </p>
              <div className="h-40 border border-dashed border-puzzle-aqua/30 rounded-md flex items-center justify-center">
                <p className="text-puzzle-aqua/70">Preferences Controls Placeholder</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
