
import { useClerkAuth } from '@/hooks/useClerkAuth';

// Legacy hook for backwards compatibility
export function useHybridAuth() {
  const clerkAuth = useClerkAuth();
  
  return {
    ...clerkAuth,
    // Add any hybrid-specific functionality here if needed
  };
}
