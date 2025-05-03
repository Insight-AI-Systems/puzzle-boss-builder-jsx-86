
import { supabase } from '@/integrations/supabase/client';
import { IntegrationWebhook, WebhookLog } from './types';

export const webhooks = {
  // Get all webhooks
  async getWebhooks(): Promise<IntegrationWebhook[]> {
    try {
      const { data, error } = await supabase
        .from('integration_webhooks')
        .select('*')
        .eq('provider', 'xero')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching webhooks:', err);
      return [];
    }
  },
  
  // Get active webhooks
  async getActiveWebhooks(): Promise<IntegrationWebhook[]> {
    try {
      const { data, error } = await supabase
        .from('integration_webhooks')
        .select('*')
        .eq('provider', 'xero')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching active webhooks:', err);
      return [];
    }
  },
  
  // Create webhook
  async createWebhook(type: string): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('xero-webhook', {
        body: { action: 'create', type }
      });
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error creating webhook:', err);
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Failed to create webhook'
      };
    }
  },
  
  // Delete webhook
  async deleteWebhook(id: string): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('xero-webhook', {
        body: { action: 'delete', id }
      });
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error deleting webhook:', err);
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Failed to delete webhook'
      };
    }
  },
  
  // Get webhook logs
  async getWebhookLogs(): Promise<WebhookLog[]> {
    try {
      const { data, error } = await supabase
        .from('webhook_logs')
        .select('*')
        .eq('provider', 'xero')
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching webhook logs:', err);
      return [];
    }
  }
};
