
import { useClerkAuth } from '@/hooks/useClerkAuth';

export const useUserProfile = () => {
  const { profile, isLoading, isAdmin } = useClerkAuth();
  
  return {
    profile,
    isLoading,
    isAdmin,
    currentUserId: profile?.id || null
  };
};
