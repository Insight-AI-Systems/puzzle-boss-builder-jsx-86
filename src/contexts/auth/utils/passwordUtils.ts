
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { AuthResult } from '../types';

/**
 * Sends a password reset email to the user
 */
export const resetPassword = async (email: string): Promise<AuthResult> => {
  console.log('Attempting password reset for:', email);
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      console.error('Password reset error:', error);
      toast({
        title: "Password reset failed",
        description: error.message,
        variant: "destructive"
      });
      return { error: { message: error.message } };
    }
    
    console.log('Password reset email sent');
    toast({
      title: "Password reset email sent",
      description: "Check your email for a password reset link."
    });
    
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error('Exception in resetPassword:', err);
    toast({
      title: "Password reset failed",
      description: err.message,
      variant: "destructive"
    });
    return { error: { message: err.message } };
  }
};
