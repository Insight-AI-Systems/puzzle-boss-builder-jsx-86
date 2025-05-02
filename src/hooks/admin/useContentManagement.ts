
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type ContentItem = {
  id: string;
  page_id: string;
  section_id: string;
  title: string | null;
  content: string | null;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export type SiteSetting = {
  id: string;
  setting_key: string;
  setting_value: string | null;
  setting_type: string;
  created_at: string;
  updated_at: string;
};

export const useContentManagement = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: contentData, error: contentError } = await supabase
        .from('site_content')
        .select('*');
      
      if (contentError) throw contentError;
      setContent(contentData || []);

      const { data: settingsData, error: settingsError } = await supabase
        .from('site_settings')
        .select('*');
      
      if (settingsError) throw settingsError;
      setSettings(settingsData || []);
      
    } catch (err) {
      console.error('Error fetching content:', err);
      setError(err instanceof Error ? err : new Error('Failed to load content'));
      toast({
        title: "Error loading content",
        description: "There was a problem loading the content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateContent = async (id: string, updates: Partial<ContentItem>) => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      setContent(prev => prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ));
      
      toast({
        title: "Content updated",
        description: "The content has been successfully updated.",
      });
      
      return data;
    } catch (err) {
      console.error('Error updating content:', err);
      toast({
        title: "Update failed",
        description: "There was a problem updating the content.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .update({ setting_value: value })
        .eq('setting_key', key)
        .select();
      
      if (error) throw error;
      
      setSettings(prev => prev.map(setting => 
        setting.setting_key === key ? { ...setting, setting_value: value } : setting
      ));
      
      toast({
        title: "Setting updated",
        description: `The ${key} setting has been updated successfully.`,
      });
      
      return data;
    } catch (err) {
      console.error('Error updating setting:', err);
      toast({
        title: "Update failed",
        description: "There was a problem updating the setting.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const getContentByPage = (pageId: string) => {
    return content.filter(item => item.page_id === pageId);
  };

  const getContentBySection = (pageId: string, sectionId: string) => {
    return content.find(item => item.page_id === pageId && item.section_id === sectionId) || null;
  };

  const getSetting = (key: string) => {
    return settings.find(setting => setting.setting_key === key)?.setting_value || null;
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return {
    content,
    settings,
    isLoading,
    error,
    updateContent,
    updateSetting,
    getContentByPage,
    getContentBySection,
    getSetting,
    refetch: fetchContent
  };
};
