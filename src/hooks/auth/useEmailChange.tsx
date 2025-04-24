
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useEmailChange() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const initiateEmailChange = async (newEmail: string, password: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password
      });
      
      if (verifyError) {
        throw new Error('Current password is incorrect');
      }
      
      const token = crypto.randomUUID();
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 24);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          email_change_token: token,
          email_change_token_expires_at: expiration.toISOString(),
          email_change_new_email: newEmail
        })
        .eq('id', user.id);
      
      if (updateError) {
        throw updateError;
      }
      
      setSuccessMessage('Verification email sent to ' + newEmail);
      
      toast({
        title: 'Email change initiated',
        description: 'Please check your new email address for verification instructions',
      });
      
    } catch (err) {
      console.error('Email change error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initiate email change');
      
      toast({
        title: 'Email change failed',
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmEmailChange = async (token: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('email_change_token, email_change_new_email, email_change_token_expires_at')
        .eq('id', user.id)
        .single();
      
      if (fetchError || !profile) {
        throw new Error('Failed to retrieve profile information');
      }
      
      if (profile.email_change_token !== token) {
        throw new Error('Invalid verification token');
      }
      
      if (new Date(profile.email_change_token_expires_at) < new Date()) {
        throw new Error('Verification token has expired');
      }
      
      const { error: updateError } = await supabase.auth.updateUser({
        email: profile.email_change_new_email
      });
      
      if (updateError) {
        throw updateError;
      }
      
      await supabase
        .from('profiles')
        .update({
          email_change_token: null,
          email_change_token_expires_at: null,
          email_change_new_email: null
        })
        .eq('id', user.id);
      
      setSuccessMessage('Email successfully updated');
      
      toast({
        title: 'Email updated',
        description: 'Your email has been successfully changed',
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to confirm email change');
      
      toast({
        title: 'Email change failed',
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
    initiateEmailChange,
    confirmEmailChange,
    setError,
    setSuccessMessage
  };
}
