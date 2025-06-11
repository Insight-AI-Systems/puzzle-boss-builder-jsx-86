
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useClerkAuth } from '@/hooks/useClerkAuth';

export function useAccountDeletion() {
  const { user } = useClerkAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAccount = async (password: string) => {
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
      
      const { error: deleteError } = await supabase.auth.admin.deleteUser(
        user.id
      );
      
      if (deleteError) {
        throw deleteError;
      }
      
      await supabase.auth.signOut();
      
      toast({
        title: 'Account deleted',
        description: 'Your account has been successfully deleted',
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
      
      toast({
        title: 'Deletion failed',
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
    deleteAccount,
    setError
  };
}
