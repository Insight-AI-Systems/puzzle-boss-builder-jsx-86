
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { XERO_CONFIG } from './config';

/**
 * Service for handling Xero webhooks
 */
export class XeroWebhookService {
  /**
   * Register a webhook with Xero
   * @param eventType - Type of event to subscribe to
   * @returns Promise with registration result
   */
  static async registerWebhook(eventType: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`[XERO WEBHOOK] Registering webhook for ${eventType}`);
      
      const response = await fetch(`${XERO_CONFIG.FUNCTION_BASE_URL}/xero-webhook-register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          eventType
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to register webhook: ${errorText}`);
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Log the successful webhook registration
      await supabase.from("sync_logs").insert({
        integration: "xero",
        direction: "outbound",
        record_type: "webhook_registration",
        record_id: eventType,
        status: "success"
      });
      
      return {
        success: true,
        message: `Successfully registered webhook for ${eventType}`
      };
    } catch (error) {
      console.error(`[XERO WEBHOOK] Error registering webhook for ${eventType}:`, error);
      
      // Log the failed webhook registration
      await supabase.from("sync_logs").insert({
        integration: "xero",
        direction: "outbound",
        record_type: "webhook_registration",
        record_id: eventType,
        status: "failed",
        error_message: error instanceof Error ? error.message : "Unknown error"
      });
      
      return {
        success: false,
        message: error instanceof Error ? error.message : `Failed to register webhook for ${eventType}`
      };
    }
  }
  
  /**
   * Get list of active webhooks
   * @returns Promise with list of active webhooks
   */
  static async getActiveWebhooks(): Promise<any[]> {
    try {
      console.log('[XERO WEBHOOK] Fetching active webhooks');
      
      const { data, error } = await supabase
        .from("integration_webhooks")
        .select("*")
        .eq("provider", "xero")
        .eq("is_active", true);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('[XERO WEBHOOK] Error fetching active webhooks:', error);
      toast({
        title: 'Error Fetching Webhooks',
        description: error instanceof Error ? error.message : 'Failed to fetch active webhooks',
        variant: 'destructive'
      });
      return [];
    }
  }
  
  /**
   * Get webhook events history
   * @param limit - Maximum number of records to retrieve
   * @param offset - Pagination offset
   * @returns Promise with webhook logs
   */
  static async getWebhookLogs(limit: number = 20, offset: number = 0): Promise<any[]> {
    try {
      console.log('[XERO WEBHOOK] Fetching webhook logs');
      
      const { data, error } = await supabase
        .from("webhook_logs")
        .select("*")
        .eq("provider", "xero")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('[XERO WEBHOOK] Error fetching webhook logs:', error);
      toast({
        title: 'Error Fetching Webhook Logs',
        description: error instanceof Error ? error.message : 'Failed to fetch webhook logs',
        variant: 'destructive'
      });
      return [];
    }
  }
  
  /**
   * Delete a webhook subscription
   * @param webhookId - ID of the webhook to delete
   * @returns Promise with deletion result
   */
  static async deleteWebhook(webhookId: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`[XERO WEBHOOK] Deleting webhook ${webhookId}`);
      
      const response = await fetch(`${XERO_CONFIG.FUNCTION_BASE_URL}/xero-webhook-delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          webhookId
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete webhook: ${errorText}`);
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Update the webhook status in the database
      await supabase
        .from("integration_webhooks")
        .update({ is_active: false })
        .eq("id", webhookId);
      
      return {
        success: true,
        message: `Successfully deleted webhook ${webhookId}`
      };
    } catch (error) {
      console.error(`[XERO WEBHOOK] Error deleting webhook ${webhookId}:`, error);
      return {
        success: false,
        message: error instanceof Error ? error.message : `Failed to delete webhook ${webhookId}`
      };
    }
  }
}
