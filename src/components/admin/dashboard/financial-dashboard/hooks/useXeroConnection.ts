
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
      
      // Set redirectUrl to the current location (admin-dashboard with finance tab)
      const currentUrl = new URL(window.location.href);
      const baseUrl = `${currentUrl.protocol}//${currentUrl.host}`;
      const redirectUrl = `${baseUrl}/admin-dashboard?tab=finance`;
      
      // Passing redirectUrl to the initiateAuth method
      const authUrl = await XeroService.initiateAuth(redirectUrl);
      window.location.href = authUrl;
    } catch (error) {
      console.error("Failed to connect to Xero:", error);
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
