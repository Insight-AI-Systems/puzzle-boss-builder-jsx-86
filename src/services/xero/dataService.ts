
import { supabase } from '@/integrations/supabase/client';
import { XeroInvoice, XeroBill, XeroTransaction, XeroContact, SyncLog } from './types';

/**
 * Service for retrieving Xero data from local database
 */
export class XeroDataService {
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
      console.error('[XERO DATA] Error fetching invoices:', error);
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
      console.error('[XERO DATA] Error fetching bills:', error);
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
      console.error('[XERO DATA] Error fetching transactions:', error);
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
      console.error('[XERO DATA] Error fetching contacts:', error);
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
      
      // Add type casting to ensure the direction and status fields are properly typed
      return data.map(log => ({
        ...log,
        direction: log.direction as 'inbound' | 'outbound',
        status: log.status as 'success' | 'failed'
      }));
    } catch (error) {
      console.error('[XERO DATA] Error fetching sync logs:', error);
      throw error;
    }
  }
}
