import { useClerkAuth } from '@/hooks/useClerkAuth';

// Legacy hook for backwards compatibility - now just uses Clerk
export function useHybridAuth() {
  return useClerkAuth();
}