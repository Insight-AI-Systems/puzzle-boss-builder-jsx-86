
import { useState } from 'react';

export interface SecurityContextType {
  securityEvents: any[];
  isLoading: boolean;
  refreshEvents: () => void;
}

export const useSecurity = (): SecurityContextType => {
  const [securityEvents] = useState([]);
  const [isLoading] = useState(false);

  const refreshEvents = () => {
    console.log('Refreshing security events');
    // TODO: Implement actual security event fetching
  };

  return {
    securityEvents,
    isLoading,
    refreshEvents
  };
};
