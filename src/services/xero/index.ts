
import { XeroAuthService } from './authService';
import { XeroWebhookService } from './webhookService';

/**
 * Service for Xero integration
 */
export class XeroService {
  /**
   * Initiates the Xero OAuth authorization flow
   * @returns Promise resolving to the authorization URL
   */
  static async initiateAuth(): Promise<string> {
    return XeroAuthService.initiateAuth();
  }
  
  /**
   * Checks the connection status with Xero
   * @returns Promise resolving to connection status
   */
  static async getConnectionStatus() {
    return XeroAuthService.getConnectionStatus();
  }
  
  /**
   * Disconnects from Xero by removing stored tokens
   * @returns Promise resolving to success status
   */
  static async disconnect(): Promise<boolean> {
    return XeroAuthService.disconnect();
  }
  
  /**
   * Refreshes the OAuth tokens if they are expired or about to expire
   * @returns Promise resolving to success status
   */
  static async refreshToken(): Promise<boolean> {
    return XeroAuthService.refreshToken();
  }
  
  /**
   * Gets active webhooks from Xero
   * @returns Promise resolving to active webhooks
   */
  static async getActiveWebhooks() {
    return XeroWebhookService.getActiveWebhooks();
  }
  
  /**
   * Gets webhook event logs
   * @param limit Number of records to return
   * @param offset Offset for pagination
   * @returns Promise resolving to webhook logs
   */
  static async getWebhookLogs(limit = 20, offset = 0) {
    return XeroWebhookService.getWebhookLogs(limit, offset);
  }
  
  /**
   * Registers a webhook for a specific event type
   * @param eventType The event type to register a webhook for
   * @returns Promise resolving to registration result
   */
  static async registerWebhook(eventType: string) {
    return XeroWebhookService.registerWebhook(eventType);
  }
  
  /**
   * Deletes a webhook
   * @param webhookId The ID of the webhook to delete
   * @returns Promise resolving to deletion result
   */
  static async deleteWebhook(webhookId: string) {
    return XeroWebhookService.deleteWebhook(webhookId);
  }
  
  /**
   * Syncs data from Xero based on record type
   * @param recordType The type of records to sync
   * @returns Promise resolving to sync result
   */
  static async syncFromXero(recordType: 'invoices' | 'bills' | 'contacts' | 'transactions' | 'all') {
    try {
      const response = await fetch(`${XERO_CONFIG.FUNCTION_BASE_URL}/xero-sync?type=${recordType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to sync from Xero: ${error}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`[XERO SYNC] Error syncing ${recordType}:`, error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : `Unknown error syncing ${recordType}`
      };
    }
  }
  
  /**
   * Gets invoices from the local database
   * @param limit Number of records to return
   * @param offset Offset for pagination
   * @returns Promise resolving to invoices
   */
  static async getInvoices(limit = 10, offset = 0) {
    try {
      const response = await fetch(`${XERO_CONFIG.FUNCTION_BASE_URL}/xero-data?type=invoices&limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }
      
      const data = await response.json();
      return data.invoices || [];
    } catch (error) {
      console.error('[XERO DATA] Error fetching invoices:', error);
      return [];
    }
  }
  
  /**
   * Gets bills from the local database
   * @param limit Number of records to return
   * @param offset Offset for pagination
   * @returns Promise resolving to bills
   */
  static async getBills(limit = 10, offset = 0) {
    try {
      const response = await fetch(`${XERO_CONFIG.FUNCTION_BASE_URL}/xero-data?type=bills&limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch bills');
      }
      
      const data = await response.json();
      return data.bills || [];
    } catch (error) {
      console.error('[XERO DATA] Error fetching bills:', error);
      return [];
    }
  }
  
  /**
   * Gets contacts from the local database
   * @param limit Number of records to return
   * @param offset Offset for pagination
   * @returns Promise resolving to contacts
   */
  static async getContacts(limit = 10, offset = 0) {
    try {
      const response = await fetch(`${XERO_CONFIG.FUNCTION_BASE_URL}/xero-data?type=contacts&limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      
      const data = await response.json();
      return data.contacts || [];
    } catch (error) {
      console.error('[XERO DATA] Error fetching contacts:', error);
      return [];
    }
  }
  
  /**
   * Gets transactions from the local database
   * @param limit Number of records to return
   * @param offset Offset for pagination
   * @returns Promise resolving to transactions
   */
  static async getTransactions(limit = 10, offset = 0) {
    try {
      const response = await fetch(`${XERO_CONFIG.FUNCTION_BASE_URL}/xero-data?type=transactions&limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      
      const data = await response.json();
      return data.transactions || [];
    } catch (error) {
      console.error('[XERO DATA] Error fetching transactions:', error);
      return [];
    }
  }

  /**
   * Gets webhooks from the local database
   * @returns Promise resolving to webhooks
   */
  static async getWebhooks() {
    try {
      console.log('[XERO DATA] Fetching active webhooks');
      
      const response = await fetch(`${XERO_CONFIG.FUNCTION_BASE_URL}/xero-webhook`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch webhooks');
      }
      
      const data = await response.json();
      return data.webhooks || [];
    } catch (error) {
      console.error('[XERO DATA] Error fetching webhooks:', error);
      return [];
    }
  }
}

// Import at the end to avoid circular dependencies
import { XERO_CONFIG } from './config';
