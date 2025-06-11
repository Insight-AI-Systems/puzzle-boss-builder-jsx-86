
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useClerkAuth } from '@/hooks/useClerkAuth';

export function usePasswordManagement() {
  const { user } = useClerkAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.primaryEmailAddress?.emailAddress!,
        password: currentPassword
      });
      
      if (verifyError) {
        throw new Error('Current password is incorrect');
      }
      
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (updateError) {
        throw updateError;
      }
      
      await supabase
        .from('profiles')
        .update({
          last_password_change: new Date().toISOString()
        })
        .eq('id', user.id);
      
      setSuccessMessage('Password successfully updated');
      
      toast({
        title: 'Password updated',
        description: 'Your password has been successfully changed',
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
      
      toast({
        title: 'Password change failed',
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
    changePassword,
    setError,
    setSuccessMessage
  };
}
