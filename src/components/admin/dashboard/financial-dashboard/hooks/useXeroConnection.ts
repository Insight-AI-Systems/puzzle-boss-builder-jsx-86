
import { useState } from 'react';
import { XeroService } from '@/services/xero';

export const useXeroConnection = (toast: any) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectToXero = async () => {
    try {
      setIsConnecting(true);
      toast({
        title: "Connecting to Xero",
        description: "Initiating connection to Xero...",
      });
      
      // Use the window.location.origin to ensure we have a proper absolute URL
      const redirectUrl = window.location.origin + '/admin-dashboard';
      
      console.log('[XERO CONNECT] Using redirect URL:', redirectUrl);
      
      // Passing redirectUrl to the initiateAuth method
      const authUrl = await XeroService.initiateAuth(redirectUrl);
      console.log('[XERO CONNECT] Received auth URL:', authUrl);
      
      if (!authUrl || !authUrl.includes('login.xero.com')) {
        throw new Error('Invalid authorization URL received from Xero');
      }
      
      // Navigate to the authorization URL
      window.location.href = authUrl;
    } catch (error) {
      console.error("[XERO CONNECT] Failed to connect to Xero:", error);
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Failed to connect to Xero",
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  };

  return { isConnecting, handleConnectToXero };
};
