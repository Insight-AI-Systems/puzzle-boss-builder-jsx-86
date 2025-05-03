
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
   * @param redirectUrl Optional custom redirect URL
   * @returns Promise resolving to the authorization URL
   */
  static async initiateAuth(redirectUrl?: string): Promise<string> {
    try {
      console.log('[XERO AUTH] Initiating OAuth flow');
      
      // Ensure redirectUrl is properly formatted
      if (redirectUrl && !redirectUrl.startsWith('http')) {
        console.warn('[XERO AUTH] RedirectUrl does not include protocol, adding https://');
        redirectUrl = `https://${redirectUrl}`;
      }
      
      const requestOptions: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      };
      
      // Add redirectUrl to request body if provided
      if (redirectUrl) {
        requestOptions.body = JSON.stringify({ redirectUrl });
        console.log('[XERO AUTH] Using custom redirect URL:', redirectUrl);
      }
      
      // Add timeout to fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      requestOptions.signal = controller.signal;
      
      try {
        const response = await fetch(`${XERO_CONFIG.FUNCTION_BASE_URL}/xero-auth?action=authorize`, requestOptions);
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Failed to initiate auth: ${error}`);
        }
        
        const data = await response.json();
        console.log('[XERO AUTH] Received auth URL:', data.url);
        return data.url;
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          throw new Error('Connection to Xero authorization service timed out');
        }
        throw fetchError;
      }
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
      // Get the auth session token for authorization
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (!accessToken) {
        throw new Error('No authentication token available');
      }
      
      const response = await fetch(`${XERO_CONFIG.FUNCTION_BASE_URL}/xero-auth?action=status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
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
      // Get the auth session token for authorization
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (!accessToken) {
        throw new Error('No authentication token available');
      }
      
      const response = await fetch(`${XERO_CONFIG.FUNCTION_BASE_URL}/xero-refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
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
