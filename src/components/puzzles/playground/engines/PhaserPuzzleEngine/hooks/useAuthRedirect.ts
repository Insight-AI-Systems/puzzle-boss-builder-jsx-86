
import { useCallback } from 'react';

export const useAuthRedirect = () => {
  const handleSignIn = useCallback(() => {
    // Since we can't directly call signIn() without parameters, 
    // we need to route to the auth page instead
    window.location.href = '/auth?redirect=/puzzle-test-playground';
  }, []);
  
  return { handleSignIn };
};
