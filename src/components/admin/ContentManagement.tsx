
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { SiteSettingsEditor } from './content/SiteSettingsEditor';
import { HeroContentEditor } from './content/HeroContentEditor';
import { PageContentEditor } from './content/PageContentEditor';
import { FooterContentEditor } from './content/FooterContentEditor';
import { useContentManagement } from '@/hooks/admin/useContentManagement';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

export const ContentManagement: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoading, error } = useContentManagement();
  
  // Determine active tab based on URL path
  const getActiveTab = () => {
    if (location.pathname.includes('/content/edit-page')) {
      return 'page-content';
    }
    
    if (location.pathname.includes('/content/hero-content')) {
      return 'hero-content';
    }
    
    if (location.pathname.includes('/content/footer-content')) {
      return 'footer-content';
    }
    
    return 'site-settings';
  };
  
  // Set initial active tab based on URL
  const [activeTab, setActiveTab] = useState(getActiveTab());
  
  // Update active tab when URL changes
  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location.pathname]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Update URL when tab changes
    switch (value) {
      case 'site-settings':
        navigate('/admin-dashboard/content');
        break;
      case 'hero-content':
        navigate('/admin-dashboard/content/hero-content');
        break;
      case 'page-content':
        navigate('/admin-dashboard/content/page-content');
        break;
      case 'footer-content':
        navigate('/admin-dashboard/content/footer-content');
        break;
      default:
        navigate('/admin-dashboard/content');
    }
  };

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

  // Render appropriate content based on the current path
  const renderTabContent = () => {
    if (location.pathname.includes('/content/edit-page/')) {
      return <PageContentEditor />;
    }

    // Standard tab content rendering
    switch (activeTab) {
      case 'site-settings':
        return <SiteSettingsEditor />;
      case 'hero-content':
        return <HeroContentEditor />;
      case 'page-content':
        return <PageContentEditor />;
      case 'footer-content':
        return <FooterContentEditor />;
      default:
        return <SiteSettingsEditor />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Management</CardTitle>
        <CardDescription>Manage website content and appearance</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="site-settings">Site Settings</TabsTrigger>
            <TabsTrigger value="hero-content">Hero Section</TabsTrigger>
            <TabsTrigger value="page-content">Page Content</TabsTrigger>
            <TabsTrigger value="footer-content">Footer</TabsTrigger>
          </TabsList>
          
          {renderTabContent()}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContentManagement;
