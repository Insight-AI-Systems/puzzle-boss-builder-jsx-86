
import { useClerkAuth } from '@/hooks/useClerkAuth';

export const useUserProfile = () => {
  const { isLoading, isAdmin } = useClerkAuth();

  return {
    isLoading,
    isAdmin
  };
};
