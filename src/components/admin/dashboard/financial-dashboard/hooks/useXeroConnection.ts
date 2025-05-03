
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
      
      // Set redirectUrl to the current full URL path to ensure it's an absolute URL
      const currentUrl = window.location.href;
      const redirectUrl = currentUrl.split('?')[0]; // Remove any query params
      
      console.log('[XERO CONNECT] Using redirect URL:', redirectUrl);
      
      // Passing redirectUrl to the initiateAuth method
      const authUrl = await XeroService.initiateAuth(redirectUrl);
      console.log('[XERO CONNECT] Received auth URL:', authUrl);
      
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
