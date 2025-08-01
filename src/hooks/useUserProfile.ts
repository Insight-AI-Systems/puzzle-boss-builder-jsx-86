
import { useAuth } from '@/contexts/AuthContext';

export const useUserProfile = () => {
  const { profile, isLoading, isAdmin } = useAuth();
  
  return {
    profile,
    isLoading,
    isAdmin,
    currentUserId: profile?.id || null
  };
};
