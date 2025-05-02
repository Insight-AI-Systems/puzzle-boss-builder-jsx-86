
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetaTagManager } from './MetaTagManager';
import { SitemapGenerator } from './SitemapGenerator';
import { StructuredDataEditor } from './StructuredDataEditor';
import { SEOAnalytics } from './SEOAnalytics';

export const SEODashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SEO Management</CardTitle>
          <CardDescription>Optimize your site for search engines</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="meta-tags" className="w-full">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="meta-tags">Meta Tags</TabsTrigger>
              <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
              <TabsTrigger value="structured-data">Structured Data</TabsTrigger>
              <TabsTrigger value="analytics">SEO Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="meta-tags" className="mt-4">
              <MetaTagManager />
            </TabsContent>

            <TabsContent value="sitemap" className="mt-4">
              <SitemapGenerator />
            </TabsContent>

            <TabsContent value="structured-data" className="mt-4">
              <StructuredDataEditor />
            </TabsContent>

            <TabsContent value="analytics" className="mt-4">
              <SEOAnalytics />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
