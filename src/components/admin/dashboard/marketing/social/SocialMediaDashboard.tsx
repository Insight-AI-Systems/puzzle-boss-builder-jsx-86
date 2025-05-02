
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocialMediaCalendar } from './SocialMediaCalendar';
import { SocialMediaAnalytics } from './SocialMediaAnalytics';
import { SocialMediaAccounts } from './SocialMediaAccounts';
import { ContentLibrary } from './ContentLibrary';

export const SocialMediaDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Social Media Management</CardTitle>
          <CardDescription>Schedule and track your social media campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="calendar">Content Calendar</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="accounts">Accounts</TabsTrigger>
              <TabsTrigger value="library">Content Library</TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="mt-4">
              <SocialMediaCalendar />
            </TabsContent>

            <TabsContent value="analytics" className="mt-4">
              <SocialMediaAnalytics />
            </TabsContent>

            <TabsContent value="accounts" className="mt-4">
              <SocialMediaAccounts />
            </TabsContent>

            <TabsContent value="library" className="mt-4">
              <ContentLibrary />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
