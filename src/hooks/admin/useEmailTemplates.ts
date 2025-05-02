
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EmailTemplate } from '@/components/admin/email/types';

export function useEmailTemplates() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Mock data for email templates
  const mockTemplates: EmailTemplate[] = [
    {
      id: '1',
      name: 'Welcome Email',
      subject: 'Welcome to our platform!',
      type: 'notification',
      status: 'active',
      created_at: new Date().toISOString(),
      last_sent: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      name: 'Monthly Newsletter',
      subject: 'See what\'s new this month',
      type: 'marketing',
      status: 'active',
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      last_sent: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      name: 'Password Reset',
      subject: 'Reset your password',
      type: 'system',
      status: 'active',
      created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Fetch templates
  const {
    data: templates,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['email-templates'],
    queryFn: async () => {
      try {
        // In a real implementation, this would fetch from Supabase
        // const { data, error } = await supabase
        //   .from('email_templates')
        //   .select('*')
        //   .order('created_at', { ascending: false });
          
        // if (error) throw error;
        // return data as EmailTemplate[];
        
        // For now, return mock data
        return mockTemplates;
      } catch (error) {
        console.error('Error fetching email templates:', error);
        throw error;
      }
    }
  });

  // Create email template
  const createTemplateMutation = useMutation({
    mutationFn: async (template: Omit<EmailTemplate, 'id' | 'created_at' | 'last_sent'>) => {
      // In a real implementation, this would insert to Supabase
      // const { data, error } = await supabase
      //   .from('email_templates')
      //   .insert(template)
      //   .select()
      //   .single();
        
      // if (error) throw error;
      // return data;
      
      // Mock implementation
      const newTemplate: EmailTemplate = {
        ...template,
        id: (Math.floor(Math.random() * 1000)).toString(),
        created_at: new Date().toISOString()
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return newTemplate;
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
      // In a real implementation, this would delete from Supabase
      // const { error } = await supabase
      //   .from('email_templates')
      //   .delete()
      //   .eq('id', id);
        
      // if (error) throw error;
      // return id;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
