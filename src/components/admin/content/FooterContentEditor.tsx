
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useContentManagement } from '@/hooks/admin/useContentManagement';

export const FooterContentEditor: React.FC = () => {
  const { content, updateContent, isLoading } = useContentManagement();
  const [companyDescription, setCompanyDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const footerContent = content.find(item => 
      item.page_id === 'footer' && item.section_id === 'company_description'
    );
    
    if (footerContent?.content) {
      setCompanyDescription(footerContent.content);
    }
  }, [content]);

  const handleSave = async () => {
    const footerContent = content.find(item => 
      item.page_id === 'footer' && item.section_id === 'company_description'
    );
    
    if (footerContent) {
      setIsSaving(true);
      try {
        await updateContent(footerContent.id, { content: companyDescription });
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (isLoading) {
    return <div>Loading footer content...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Footer Content</h2>
      <p className="text-muted-foreground">
        Edit the content that appears in the site footer.
      </p>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-description">Company Description</Label>
              <Textarea 
                id="company-description"
                value={companyDescription}
                onChange={(e) => setCompanyDescription(e.target.value)}
                placeholder="We create engaging puzzle experiences with real rewards."
                rows={3}
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
    </div>
  );
};
