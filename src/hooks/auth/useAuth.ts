
// Legacy compatibility wrapper for useClerkAuth
import { useClerkAuth } from '@/hooks/useClerkAuth';

export const useAuth = () => {
  return useClerkAuth();
};
