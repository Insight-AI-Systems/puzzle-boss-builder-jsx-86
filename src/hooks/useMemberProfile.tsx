
import { useClerkAuth } from '@/hooks/useClerkAuth';

export function useMemberProfile() {
  const { profile, isLoading } = useClerkAuth();

  return { 
    profile, 
    isLoading 
  };
}
