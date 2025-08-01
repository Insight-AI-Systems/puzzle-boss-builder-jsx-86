
import { useAuth } from '@/contexts/AuthContext';

export function useMemberProfile() {
  const { profile, isLoading } = useAuth();

  return { 
    profile, 
    isLoading 
  };
}
