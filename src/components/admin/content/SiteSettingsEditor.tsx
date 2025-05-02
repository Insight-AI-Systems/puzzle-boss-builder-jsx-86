
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useContentManagement } from '@/hooks/admin/useContentManagement';

export const SiteSettingsEditor: React.FC = () => {
  const { settings, updateSetting, isLoading } = useContentManagement();
  const [logoUrl, setLogoUrl] = useState(settings.find(s => s.setting_key === 'site_logo_url')?.setting_value || '');
  const [tagline, setTagline] = useState(settings.find(s => s.setting_key === 'site_tagline')?.setting_value || '');
  const [description, setDescription] = useState(settings.find(s => s.setting_key === 'site_description')?.setting_value || '');
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});

  const handleSave = async (key: string, value: string) => {
    setIsSaving(prev => ({ ...prev, [key]: true }));
    try {
      await updateSetting(key, value);
    } finally {
      setIsSaving(prev => ({ ...prev, [key]: false }));
    }
  };

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Site Settings</h2>
      <p className="text-muted-foreground">
        Manage global site settings like logo, tagline, and description.
      </p>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo-url">Logo URL</Label>
              <div className="flex space-x-2">
                <Input 
                  id="logo-url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="/images/logo.svg" 
                />
                <Button 
                  onClick={() => handleSave('site_logo_url', logoUrl)}
                  disabled={isSaving['site_logo_url']}
                >
                  {isSaving['site_logo_url'] ? 'Saving...' : 'Save'}
                </Button>
              </div>
              {logoUrl && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-1">Preview:</p>
                  <img src={logoUrl} alt="Logo Preview" className="h-16 object-contain" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Site Tagline</Label>
              <div className="flex space-x-2">
                <Input 
                  id="tagline"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Race to solve. Win real prizes." 
                />
                <Button 
                  onClick={() => handleSave('site_tagline', tagline)}
                  disabled={isSaving['site_tagline']}
                >
                  {isSaving['site_tagline'] ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Site Description</Label>
              <div className="flex space-x-2">
                <Input 
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Experience our unique puzzle-solving platform..." 
                />
                <Button 
                  onClick={() => handleSave('site_description', description)}
                  disabled={isSaving['site_description']}
                >
                  {isSaving['site_description'] ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
