
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SocialAuthState {
  isLoading: boolean;
  errorMessage: string;
}

interface SocialAuthActions {
  handleGoogleAuth: () => Promise<void>;
  setErrorMessage: (message: string) => void;
}

export function useSocialAuth(): SocialAuthState & SocialAuthActions {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      console.log('Attempting Google sign in');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      
      if (error) {
        console.error('Google auth error:', error);
        setErrorMessage(error.message);
        throw error;
      }
    } catch (error) {
      console.error('Google auth error:', error);
      
      toast({
        title: 'Authentication error',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    errorMessage,
    handleGoogleAuth,
    setErrorMessage
  };
}
