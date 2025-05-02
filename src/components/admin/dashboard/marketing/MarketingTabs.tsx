
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEODashboard } from "./seo/SEODashboard";
import { SocialMediaDashboard } from "./social/SocialMediaDashboard";
import { ContentCalendar } from "./content/ContentCalendar";
import { BrandMonitoring } from "./brand/BrandMonitoring";
import { MarketingAnalytics } from "./analytics/MarketingAnalytics";

export const MarketingTabs: React.FC = () => {
  return (
    <Tabs defaultValue="seo" className="w-full">
      <TabsList className="grid grid-cols-5 mb-6">
        <TabsTrigger value="seo">SEO</TabsTrigger>
        <TabsTrigger value="social">Social Media</TabsTrigger>
        <TabsTrigger value="content">Content Calendar</TabsTrigger>
        <TabsTrigger value="brand">Brand Monitoring</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="seo" className="space-y-4">
        <SEODashboard />
      </TabsContent>

      <TabsContent value="social" className="space-y-4">
        <SocialMediaDashboard />
      </TabsContent>

      <TabsContent value="content" className="space-y-4">
        <ContentCalendar />
      </TabsContent>

      <TabsContent value="brand" className="space-y-4">
        <BrandMonitoring />
      </TabsContent>

      <TabsContent value="analytics" className="space-y-4">
        <MarketingAnalytics />
      </TabsContent>
    </Tabs>
  );
};
