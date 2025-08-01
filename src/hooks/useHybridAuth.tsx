import { useAuth } from '@/contexts/AuthContext';

// Legacy hook for backwards compatibility - now uses Supabase
export function useHybridAuth() {
  return useAuth();
}