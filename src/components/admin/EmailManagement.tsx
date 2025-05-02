
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmailTemplates } from "./email/EmailTemplates";
import { EmailCampaigns } from "./email/EmailCampaigns";
import { EmailSettings } from "./email/EmailSettings";
import { EmailSegmentation } from "./email/EmailSegmentation";
import { EmailAnalytics } from "./email/EmailAnalytics";

export const EmailManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState("templates");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Management</CardTitle>
        <CardDescription>Manage email templates, campaigns, and settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="templates" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="segmentation">Segmentation</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates" className="space-y-4">
            <EmailTemplates />
          </TabsContent>
          
          <TabsContent value="campaigns" className="space-y-4">
            <EmailCampaigns />
          </TabsContent>
          
          <TabsContent value="segmentation" className="space-y-4">
            <EmailSegmentation />
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <EmailAnalytics />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <EmailSettings />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmailManagement;
