
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Service for managing Zapier integrations with Xero
 */
export class ZapierService {
  /**
   * Send data to Xero via a Zapier webhook
   * @param webhookUrl - The Zapier webhook URL
   * @param data - The data to send to Xero
   * @returns Promise resolving to success status and message
   */
  static async sendToXero(webhookUrl: string, data: any): Promise<{ success: boolean; message: string }> {
    try {
      console.log('[ZAPIER SERVICE] Sending data to Xero via Zapier:', {
        webhookUrl: webhookUrl.substring(0, 20) + '...',
        dataKeys: Object.keys(data)
      });
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors', // Handle CORS for webhook calls
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
          source: 'puzzle_platform'
        }),
      });
      
      // Since we're using no-cors, we won't get a proper response status
      console.log('[ZAPIER SERVICE] Request sent to Zapier webhook');
      
      return {
        success: true,
        message: 'Data sent to Xero via Zapier. Please check Zapier for confirmation.'
      };
    } catch (error) {
      console.error('[ZAPIER SERVICE] Error sending data to Xero via Zapier:', error);
      return {
        success: false,
        message: error instanceof Error 
          ? `Failed to send data: ${error.message}` 
          : 'Failed to send data to Xero via Zapier'
      };
    }
  }
  
  /**
   * Store a webhook URL for Xero integration
   * @param webhookType - The type of webhook (e.g., 'invoices', 'expenses')
   * @param webhookUrl - The Zapier webhook URL
   */
  static async saveWebhookUrl(webhookType: string, webhookUrl: string): Promise<{ success: boolean; message: string }> {
    try {
      const { data, error } = await supabase
        .from('integration_webhooks')
        .upsert({
          type: webhookType,
          provider: 'zapier',
          url: webhookUrl,
          is_active: true,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'type,provider'
        });
        
      if (error) throw error;
      
      console.log('[ZAPIER SERVICE] Webhook URL saved successfully');
      return { 
        success: true, 
        message: 'Webhook URL saved successfully' 
      };
    } catch (error) {
      console.error('[ZAPIER SERVICE] Error saving webhook URL:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to save webhook URL' 
      };
    }
  }
  
  /**
   * Get stored webhook URL
   * @param webhookType - The type of webhook
   * @returns The webhook URL or null if not found
   */
  static async getWebhookUrl(webhookType: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('integration_webhooks')
        .select('url')
        .eq('type', webhookType)
        .eq('provider', 'zapier')
        .eq('is_active', true)
        .single();
        
      if (error) throw error;
      
      return data?.url || null;
    } catch (error) {
      console.error('[ZAPIER SERVICE] Error fetching webhook URL:', error);
      return null;
    }
  }
  
  /**
   * Send financial data to Xero via Zapier
   * @param financialData - The financial data to send
   * @param type - The type of financial data (income, expense, etc.)
   */
  static async syncFinancialData(
    financialData: any, 
    type: 'income' | 'expense' | 'invoice' | 'bill'
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Get the appropriate webhook URL for this data type
      const webhookUrl = await this.getWebhookUrl(type);
      
      if (!webhookUrl) {
        return {
          success: false,
          message: `No webhook URL configured for ${type} data. Please set up the integration.`
        };
      }
      
      // Send the data to Zapier
      return await this.sendToXero(webhookUrl, financialData);
    } catch (error) {
      console.error(`[ZAPIER SERVICE] Error syncing ${type} data:`, error);
      return {
        success: false,
        message: error instanceof Error ? error.message : `Failed to sync ${type} data`
      };
    }
  }
  
  /**
   * Test the Zapier-Xero connection
   * @param webhookUrl - The Zapier webhook URL to test
   */
  static async testConnection(webhookUrl: string): Promise<{ success: boolean; message: string }> {
    try {
      // Send a test payload
      const testResult = await this.sendToXero(webhookUrl, {
        test: true,
        message: 'Testing Zapier-Xero integration',
        timestamp: new Date().toISOString()
      });
      
      return testResult;
    } catch (error) {
      console.error('[ZAPIER SERVICE] Error testing Zapier connection:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to test Zapier connection'
      };
    }
  }
}
