
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EmailTemplate } from '@/components/admin/email/types';

export function useEmailTemplates() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch templates from Supabase
  const {
    data: templates,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['email-templates'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('email_templates')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        return data as EmailTemplate[];
      } catch (error) {
        console.error('Error fetching email templates:', error);
        throw error;
      }
    }
  });

  // Create email template
  const createTemplateMutation = useMutation({
    mutationFn: async (template: Omit<EmailTemplate, 'id' | 'created_at' | 'last_sent'>) => {
      const { data, error } = await supabase
        .from('email_templates')
        .insert(template)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
    },
    onError: (error) => {
      console.error('Error creating template:', error);
      toast({
        title: "Failed to create template",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  });

  // Delete email template
  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
    },
    onError: (error) => {
      console.error('Error deleting template:', error);
      toast({
        title: "Failed to delete template",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  });

  const refreshTemplates = () => {
    refetch();
  };

  const createTemplate = async (template: Omit<EmailTemplate, 'id' | 'created_at' | 'last_sent'>) => {
    return createTemplateMutation.mutateAsync(template);
  };

  const deleteTemplate = async (id: string) => {
    return deleteTemplateMutation.mutateAsync(id);
  };

  return {
    templates,
    isLoading,
    error,
    createTemplate,
    deleteTemplate,
    refreshTemplates
  };
}
