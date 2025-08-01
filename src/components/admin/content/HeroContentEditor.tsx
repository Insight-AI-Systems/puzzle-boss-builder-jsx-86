
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useContentManagement } from '@/hooks/admin/useContentManagement';


export const HeroContentEditor: React.FC = () => {
  const { content, updateContent, isLoading } = useContentManagement();
  const [heading, setHeading] = useState('');
  const [subheading, setSubheading] = useState('');
  const [showPuzzleManager, setShowPuzzleManager] = useState(false);
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const headingContent = content.find(item => 
      item.page_id === 'home' && item.section_id === 'hero_heading'
    );
    const subheadingContent = content.find(item => 
      item.page_id === 'home' && item.section_id === 'hero_subheading'
    );

    if (headingContent?.content) {
      setHeading(headingContent.content);
    }
    if (subheadingContent?.content) {
      setSubheading(subheadingContent.content);
    }
  }, [content]);

  const handleSaveContent = async (id: string, contentText: string) => {
    setIsSaving(prev => ({ ...prev, [id]: true }));
    try {
      const contentItem = content.find(item => item.id === id);
      if (contentItem) {
        await updateContent(id, { content: contentText });
      }
    } finally {
      setIsSaving(prev => ({ ...prev, [id]: false }));
    }
  };

  if (isLoading) {
    return <div>Loading hero content...</div>;
  }

  const headingContent = content.find(item => 
    item.page_id === 'home' && item.section_id === 'hero_heading'
  );
  const subheadingContent = content.find(item => 
    item.page_id === 'home' && item.section_id === 'hero_subheading'
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Hero Section</h2>
      <p className="text-muted-foreground">
        Edit the main hero section content that appears at the top of the homepage.
      </p>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hero-heading">Hero Heading</Label>
              <div className="flex space-x-2">
                <Input 
                  id="hero-heading"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  placeholder="Race to solve. Win real prizes."
                />
                <Button 
                  onClick={() => headingContent && handleSaveContent(headingContent.id, heading)}
                  disabled={!headingContent || isSaving[headingContent.id]}
                >
                  {headingContent && isSaving[headingContent.id] ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero-subheading">Hero Subheading</Label>
              <div className="flex space-x-2">
                <Textarea 
                  id="hero-subheading"
                  value={subheading}
                  onChange={(e) => setSubheading(e.target.value)}
                  placeholder="Our online puzzle platform offers exciting challenges and real rewards."
                  rows={2}
                />
                <Button 
                  onClick={() => subheadingContent && handleSaveContent(subheadingContent.id, subheading)}
                  disabled={!subheadingContent || isSaving[subheadingContent.id]}
                  className="h-auto"
                >
                  {subheadingContent && isSaving[subheadingContent.id] ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};
