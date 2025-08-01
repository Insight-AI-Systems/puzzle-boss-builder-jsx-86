// Legacy compatibility wrapper - now uses AuthContext
import { useAuth as useAuthContext } from '@/contexts/AuthContext';

export const useAuth = () => {
  return useAuthContext();
};