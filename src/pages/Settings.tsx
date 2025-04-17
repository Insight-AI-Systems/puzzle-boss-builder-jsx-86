
import React from 'react';
import PageLayout from '@/components/layouts/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BellRing, ShieldCheck, UserCog, CreditCard, Globe } from 'lucide-react';

const Settings = () => {
  return (
    <PageLayout 
      title="Account Settings" 
      subtitle="Manage your account preferences and settings"
    >
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
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
        
        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2 text-puzzle-aqua" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Manage your account security and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This section will contain password change controls, two-factor authentication setup, and privacy settings for your account.
              </p>
              <div className="h-40 border border-dashed border-puzzle-aqua/30 rounded-md flex items-center justify-center">
                <p className="text-puzzle-aqua/70">Security Controls Placeholder</p>
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
    </PageLayout>
  );
};

export default Settings;
