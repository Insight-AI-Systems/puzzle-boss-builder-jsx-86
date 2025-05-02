
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { XeroAuthStatus } from './types';
import { XERO_CONFIG } from './config';

/**
 * Service for Xero authentication
 */
export class XeroAuthService {
  /**
   * Initiates the Xero OAuth authorization flow
   * @returns Promise resolving to the authorization URL
   */
  static async initiateAuth(): Promise<string> {
    try {
      console.log('[XERO AUTH] Initiating OAuth flow');
      
      const response = await fetch(`${XERO_CONFIG.FUNCTION_BASE_URL}/xero-auth?action=authorize`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to initiate auth: ${error}`);
      }
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('[XERO AUTH] Error initiating OAuth flow:', error);
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
      const response = await fetch(`${XERO_CONFIG.FUNCTION_BASE_URL}/xero-auth?action=status`, {
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
      console.error('[XERO AUTH] Error checking connection status:', error);
      return { connected: false };
    }
  }
  
  /**
   * Refreshes the OAuth tokens if they are expired or about to expire
   * @returns Promise resolving to success status
   */
  static async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${XERO_CONFIG.FUNCTION_BASE_URL}/xero-refresh-token`, {
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
      console.error('[XERO AUTH] Error refreshing token:', error);
      return false;
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
      console.error('[XERO AUTH] Error disconnecting from Xero:', error);
      return false;
    }
  }
}
