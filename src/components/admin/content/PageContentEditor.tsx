
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContentManagement } from '@/hooks/admin/useContentManagement';
import { ContentEditor } from './ContentEditor';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

type PageTab = {
  id: string;
  name: string;
};

export const PageContentEditor: React.FC = () => {
  const { pageId } = useParams<{ pageId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { content, updateContent, isLoading } = useContentManagement();
  
  // Extract pageId from URL if not provided via params
  const getPageIdFromURL = () => {
    const path = location.pathname;
    if (path.includes('/edit-page/')) {
      return path.split('/edit-page/')[1];
    }
    return null;
  };
  
  const currentPageId = pageId || getPageIdFromURL() || 'about';
  const [activeTab, setActiveTab] = useState(currentPageId);
  const [pageContent, setPageContent] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const pageTabs: PageTab[] = [
    { id: 'about', name: 'About' },
    { id: 'terms', name: 'Terms & Conditions' },
    { id: 'privacy', name: 'Privacy Policy' },
    { id: 'faq', name: 'FAQ' },
    { id: 'cookie-policy', name: 'Cookie Policy' },
  ];

  useEffect(() => {
    if (currentPageId) {
      setActiveTab(currentPageId);
      loadPageContent(currentPageId);
    }
  }, [currentPageId, content]);

  const loadPageContent = (pageId: string) => {
    const pageData = content.find(item => 
      item.page_id === pageId && item.section_id === 'main_content'
    );
    
    if (pageData) {
      setPageContent(pageData.content || '');
      setPageTitle(pageData.title || '');
    } else {
      setPageContent('');
      setPageTitle('');
    }
  };

  const handleSave = async () => {
    const pageData = content.find(item => 
      item.page_id === activeTab && item.section_id === 'main_content'
    );
    
    if (pageData) {
      setIsSaving(true);
      try {
        await updateContent(pageData.id, { 
          content: pageContent, 
          title: pageTitle 
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    navigate(`/admin-dashboard/content/edit-page/${tabId}`);
  };

  if (isLoading) {
    return <div>Loading page content...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Page Content</h2>
      <p className="text-muted-foreground">
        Edit the content of different pages on your site.
      </p>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          {pageTabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id}>{tab.name}</TabsTrigger>
          ))}
        </TabsList>

        {pageTabs.map(tab => (
          <TabsContent key={tab.id} value={tab.id} className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="page-title">Page Title</Label>
                    <Input 
                      id="page-title"
                      value={pageTitle}
                      onChange={(e) => setPageTitle(e.target.value)}
                      placeholder="Enter page title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="page-content">Page Content</Label>
                    <ContentEditor 
                      initialValue={pageContent}
                      onChange={setPageContent}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSave} 
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
