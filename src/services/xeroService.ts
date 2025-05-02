
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  XeroInvoice, 
  XeroBill, 
  XeroTransaction, 
  XeroContact,
  XeroOAuthToken,
  SyncResult,
  XeroAuthStatus
} from '@/types/integration';

/**
 * Service for direct integration with Xero API
 */
export class XeroService {
  private static readonly FUNCTION_BASE_URL = 'https://vcacfysfjgoahledqdwa.functions.supabase.co';

  /**
   * Initiates the Xero OAuth authorization flow
   * @returns Promise resolving to the authorization URL
   */
  static async initiateAuth(): Promise<string> {
    try {
      console.log('[XERO SERVICE] Initiating OAuth flow');
      
      const response = await fetch(`${this.FUNCTION_BASE_URL}/xero-auth?action=authorize`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.auth.session()?.access_token}`
        },
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to initiate auth: ${error}`);
      }
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('[XERO SERVICE] Error initiating OAuth flow:', error);
      toast({
        title: 'Authentication Error',
        description: error instanceof Error ? error.message : 'Failed to start Xero authentication',
        variant: 'destructive'
      });
      throw error;
    }
  }
  
  /**
   * Checks the connection status with Xero
   * @returns Promise resolving to connection status
   */
  static async getConnectionStatus(): Promise<XeroAuthStatus> {
    try {
      const response = await fetch(`${this.FUNCTION_BASE_URL}/xero-auth?action=status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to get status: ${error}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('[XERO SERVICE] Error checking connection status:', error);
      return { connected: false };
    }
  }
  
  /**
   * Refreshes the OAuth tokens if they are expired or about to expire
   * @returns Promise resolving to success status
   */
  static async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${this.FUNCTION_BASE_URL}/xero-refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to refresh token: ${error}`);
      }
      
      const result = await response.json();
      return !result.error;
    } catch (error) {
      console.error('[XERO SERVICE] Error refreshing token:', error);
      return false;
    }
  }
  
  /**
   * Synchronizes data from Xero to local database
   * @param recordType - Type of records to sync (invoices, bills, contacts, etc.)
   * @param days - Number of days of history to sync
   * @returns Promise resolving to sync result
   */
  static async syncFromXero(
    recordType: 'invoices' | 'bills' | 'contacts' | 'transactions' | 'all',
    days: number = 30
  ): Promise<SyncResult> {
    try {
      console.log(`[XERO SERVICE] Starting sync for ${recordType}`);
      
      const response = await fetch(`${this.FUNCTION_BASE_URL}/xero-sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recordType,
          days
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Sync failed: ${errorText}`);
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      return {
        success: true,
        message: `Successfully synchronized ${recordType} from Xero`,
        data: result
      };
    } catch (error) {
      console.error(`[XERO SERVICE] Error syncing ${recordType}:`, error);
      return {
        success: false,
        message: error instanceof Error ? error.message : `Failed to sync ${recordType}`
      };
    }
  }
  
  /**
   * Get invoices from local database
   * @param limit - Maximum number of records to retrieve
   * @param offset - Pagination offset
   * @returns Promise resolving to invoices array
   */
  static async getInvoices(limit: number = 10, offset: number = 0): Promise<XeroInvoice[]> {
    try {
      const { data, error } = await supabase
        .from('xero_invoices')
        .select('*')
        .order('date', { ascending: false })
        .range(offset, offset + limit - 1);
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('[XERO SERVICE] Error fetching invoices:', error);
      throw error;
    }
  }
  
  /**
   * Get bills from local database
   * @param limit - Maximum number of records to retrieve
   * @param offset - Pagination offset
   * @returns Promise resolving to bills array
   */
  static async getBills(limit: number = 10, offset: number = 0): Promise<XeroBill[]> {
    try {
      const { data, error } = await supabase
        .from('xero_bills')
        .select('*')
        .order('date', { ascending: false })
        .range(offset, offset + limit - 1);
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('[XERO SERVICE] Error fetching bills:', error);
      throw error;
    }
  }
  
  /**
   * Get transactions from local database
   * @param limit - Maximum number of records to retrieve
   * @param offset - Pagination offset
   * @returns Promise resolving to transactions array
   */
  static async getTransactions(limit: number = 10, offset: number = 0): Promise<XeroTransaction[]> {
    try {
      const { data, error } = await supabase
        .from('xero_transactions')
        .select('*')
        .order('date', { ascending: false })
        .range(offset, offset + limit - 1);
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('[XERO SERVICE] Error fetching transactions:', error);
      throw error;
    }
  }

  /**
   * Get contacts from local database
   * @param limit - Maximum number of records to retrieve
   * @param offset - Pagination offset
   * @returns Promise resolving to contacts array
   */
  static async getContacts(limit: number = 10, offset: number = 0): Promise<XeroContact[]> {
    try {
      const { data, error } = await supabase
        .from('xero_contacts')
        .select('*')
        .order('name', { ascending: true })
        .range(offset, offset + limit - 1);
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('[XERO SERVICE] Error fetching contacts:', error);
      throw error;
    }
  }
  
  /**
   * Get synchronization logs
   * @param limit - Maximum number of records to retrieve
   * @param offset - Pagination offset
   * @returns Promise resolving to sync logs array
   */
  static async getSyncLogs(limit: number = 20, offset: number = 0): Promise<SyncLog[]> {
    try {
      const { data, error } = await supabase
        .from('sync_logs')
        .select('*')
        .eq('integration', 'xero')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('[XERO SERVICE] Error fetching sync logs:', error);
      throw error;
    }
  }

  /**
   * Disconnects from Xero by removing stored tokens
   * @returns Promise resolving to success status
   */
  static async disconnect(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('xero_oauth_tokens')
        .delete()
        .gt('id', '0');  // Delete all token records
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('[XERO SERVICE] Error disconnecting from Xero:', error);
      return false;
    }
  }
}
