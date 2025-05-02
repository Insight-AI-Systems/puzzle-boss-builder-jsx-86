
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { SiteSettingsEditor } from './content/SiteSettingsEditor';
import { HeroContentEditor } from './content/HeroContentEditor';
import { PageContentEditor } from './content/PageContentEditor';
import { FooterContentEditor } from './content/FooterContentEditor';
import { useContentManagement } from '@/hooks/admin/useContentManagement';

export const ContentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('site-settings');
  const { toast } = useToast();
  const { isLoading, error } = useContentManagement();

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>
            There was a problem loading the content management system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
          <CardDescription>Loading content management system...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="w-8 h-8 border-4 border-puzzle-aqua border-t-transparent rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Management</CardTitle>
        <CardDescription>Manage website content and appearance</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="site-settings">Site Settings</TabsTrigger>
            <TabsTrigger value="hero-content">Hero Section</TabsTrigger>
            <TabsTrigger value="page-content">Page Content</TabsTrigger>
            <TabsTrigger value="footer-content">Footer</TabsTrigger>
          </TabsList>
          <TabsContent value="site-settings" className="space-y-4">
            <SiteSettingsEditor />
          </TabsContent>
          <TabsContent value="hero-content" className="space-y-4">
            <HeroContentEditor />
          </TabsContent>
          <TabsContent value="page-content" className="space-y-4">
            <PageContentEditor />
          </TabsContent>
          <TabsContent value="footer-content" className="space-y-4">
            <FooterContentEditor />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContentManagement;
