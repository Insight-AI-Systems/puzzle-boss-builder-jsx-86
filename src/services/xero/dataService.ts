
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { XeroInvoice, XeroBill, XeroTransaction, XeroContact, SyncLog, IntegrationWebhook, WebhookLog } from './types';

/**
 * Service for retrieving Xero data from the local database
 */
export class XeroDataService {
  /**
   * Get invoices from local database
   * @param limit - Maximum number of records to return
   * @param offset - Pagination offset
   * @returns Promise with invoices array
   */
  static async getInvoices(limit = 20, offset = 0): Promise<XeroInvoice[]> {
    try {
      console.log(`[XERO DATA] Fetching ${limit} invoices from offset ${offset}`);
      
      const { data, error } = await supabase
        .from('xero_invoices')
        .select('*')
        .order('date', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('[XERO DATA] Error fetching invoices:', error);
      toast({
        title: 'Error Fetching Invoices',
        description: error instanceof Error ? error.message : 'Failed to fetch invoices',
        variant: 'destructive'
      });
      return [];
    }
  }
  
  /**
   * Get bills from local database
   * @param limit - Maximum number of records to return
   * @param offset - Pagination offset
   * @returns Promise with bills array
   */
  static async getBills(limit = 20, offset = 0): Promise<XeroBill[]> {
    try {
      console.log(`[XERO DATA] Fetching ${limit} bills from offset ${offset}`);
      
      const { data, error } = await supabase
        .from('xero_bills')
        .select('*')
        .order('date', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('[XERO DATA] Error fetching bills:', error);
      toast({
        title: 'Error Fetching Bills',
        description: error instanceof Error ? error.message : 'Failed to fetch bills',
        variant: 'destructive'
      });
      return [];
    }
  }
  
  /**
   * Get transactions from local database
   * @param limit - Maximum number of records to return
   * @param offset - Pagination offset
   * @returns Promise with transactions array
   */
  static async getTransactions(limit = 20, offset = 0): Promise<XeroTransaction[]> {
    try {
      console.log(`[XERO DATA] Fetching ${limit} transactions from offset ${offset}`);
      
      const { data, error } = await supabase
        .from('xero_transactions')
        .select('*')
        .order('date', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('[XERO DATA] Error fetching transactions:', error);
      toast({
        title: 'Error Fetching Transactions',
        description: error instanceof Error ? error.message : 'Failed to fetch transactions',
        variant: 'destructive'
      });
      return [];
    }
  }
  
  /**
   * Get contacts from local database
   * @param limit - Maximum number of records to return
   * @param offset - Pagination offset
   * @returns Promise with contacts array
   */
  static async getContacts(limit = 20, offset = 0): Promise<XeroContact[]> {
    try {
      console.log(`[XERO DATA] Fetching ${limit} contacts from offset ${offset}`);
      
      const { data, error } = await supabase
        .from('xero_contacts')
        .select('*')
        .order('name')
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('[XERO DATA] Error fetching contacts:', error);
      toast({
        title: 'Error Fetching Contacts',
        description: error instanceof Error ? error.message : 'Failed to fetch contacts',
        variant: 'destructive'
      });
      return [];
    }
  }
  
  /**
   * Get sync logs from local database
   * @param limit - Maximum number of records to return
   * @param offset - Pagination offset
   * @returns Promise with sync logs array
   */
  static async getSyncLogs(limit = 20, offset = 0): Promise<SyncLog[]> {
    try {
      console.log(`[XERO DATA] Fetching ${limit} sync logs from offset ${offset}`);
      
      const { data, error } = await supabase
        .from('sync_logs')
        .select('*')
        .eq('integration', 'xero')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      
      // Cast both direction and status fields to ensure TypeScript compatibility
      const typedData = data?.map(item => ({
        ...item,
        direction: item.direction as "inbound" | "outbound",
        status: item.status as "success" | "failed"
      })) || [];
      
      return typedData;
    } catch (error) {
      console.error('[XERO DATA] Error fetching sync logs:', error);
      toast({
        title: 'Error Fetching Sync Logs',
        description: error instanceof Error ? error.message : 'Failed to fetch sync logs',
        variant: 'destructive'
      });
      return [];
    }
  }
  
  /**
   * Get webhook logs from local database
   * @param limit - Maximum number of records to return
   * @param offset - Pagination offset
   * @returns Promise with webhook logs array
   */
  static async getWebhookLogs(limit = 20, offset = 0): Promise<WebhookLog[]> {
    try {
      console.log(`[XERO DATA] Fetching ${limit} webhook logs from offset ${offset}`);
      
      const { data, error } = await supabase
        .from('webhook_logs')
        .select('*')
        .eq('provider', 'xero')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('[XERO DATA] Error fetching webhook logs:', error);
      toast({
        title: 'Error Fetching Webhook Logs',
        description: error instanceof Error ? error.message : 'Failed to fetch webhook logs',
        variant: 'destructive'
      });
      return [];
    }
  }
  
  /**
   * Get active webhooks from local database
   * @returns Promise with active webhooks array
   */
  static async getActiveWebhooks(): Promise<IntegrationWebhook[]> {
    try {
      console.log('[XERO DATA] Fetching active webhooks');
      
      const { data, error } = await supabase
        .from('integration_webhooks')
        .select('*')
        .eq('provider', 'xero')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('[XERO DATA] Error fetching active webhooks:', error);
      toast({
        title: 'Error Fetching Webhooks',
        description: error instanceof Error ? error.message : 'Failed to fetch webhooks',
        variant: 'destructive'
      });
      return [];
    }
  }
}
