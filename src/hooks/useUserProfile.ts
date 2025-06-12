
import { useClerkAuth } from '@/hooks/useClerkAuth';

// Check if Clerk is available
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export const useUserProfile = () => {
  // Only use Clerk hooks if Clerk is configured
  if (PUBLISHABLE_KEY) {
    try {
      const { profile, isLoading, isAdmin } = useClerkAuth();
      return {
        profile,
        isLoading,
        isAdmin,
        currentUserId: profile?.id || null
      };
    } catch (error) {
      console.warn('Clerk not available, running without authentication');
    }
  }

  // Return default values when Clerk is not configured
  return {
    profile: null,
    isLoading: false,
    isAdmin: false,
    currentUserId: null
  };
};
