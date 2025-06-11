
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useClerkAuth } from '@/hooks/useClerkAuth';

export function useTwoFactorAuth() {
  const { user } = useClerkAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const toggleTwoFactorAuth = async (enabled: boolean, password: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.primaryEmailAddress?.emailAddress!,
        password
      });
      
      if (verifyError) {
        throw new Error('Password is incorrect');
      }
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          two_factor_enabled: enabled
        })
        .eq('id', user.id);
      
      if (updateError) {
        throw updateError;
      }
      
      setSuccessMessage(`Two-factor authentication ${enabled ? 'enabled' : 'disabled'}`);
      
      toast({
        title: 'Two-factor authentication updated',
        description: `Two-factor authentication has been ${enabled ? 'enabled' : 'disabled'}`,
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update two-factor authentication');
      
      toast({
        title: 'Update failed',
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    successMessage,
    toggleTwoFactorAuth,
    setError,
    setSuccessMessage
  };
}
