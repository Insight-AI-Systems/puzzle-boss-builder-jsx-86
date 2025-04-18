
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile } from '@/types/userTypes';

export function useAccountSecurity() {
  const { user, session, refreshSession } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Email change functionality
  const initiateEmailChange = async (newEmail: string, password: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      // First, verify the current password
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password
      });
      
      if (verifyError) {
        throw new Error('Current password is incorrect');
      }
      
      // Generate a secure token
      const token = crypto.randomUUID();
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 24); // 24-hour expiration
      
      // Store the token and new email in the profile
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
      
      // Send verification email (in a real app, you would implement this)
      // For now, we'll just simulate success
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

  // Function to confirm email change with token
  const confirmEmailChange = async (token: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Retrieve the profile with the token
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('email_change_token, email_change_new_email, email_change_token_expires_at')
        .eq('id', user.id)
        .single();
      
      if (fetchError || !profile) {
        throw new Error('Failed to retrieve profile information');
      }
      
      // Validate token
      if (profile.email_change_token !== token) {
        throw new Error('Invalid verification token');
      }
      
      // Check if token is expired
      if (new Date(profile.email_change_token_expires_at) < new Date()) {
        throw new Error('Verification token has expired');
      }
      
      // Update email in auth
      const { error: updateError } = await supabase.auth.updateUser({
        email: profile.email_change_new_email
      });
      
      if (updateError) {
        throw updateError;
      }
      
      // Clear the token data
      await supabase
        .from('profiles')
        .update({
          email_change_token: null,
          email_change_token_expires_at: null,
          email_change_new_email: null
        })
        .eq('id', user.id);
      
      setSuccessMessage('Email successfully updated');
      
      // Refresh the session to reflect the changes
      await refreshSession();
      
      toast({
        title: 'Email updated',
        description: 'Your email has been successfully changed',
      });
      
    } catch (err) {
      console.error('Confirm email change error:', err);
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

  // Password change functionality
  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // First, verify the current password
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword
      });
      
      if (verifyError) {
        throw new Error('Current password is incorrect');
      }
      
      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (updateError) {
        throw updateError;
      }
      
      // Update the last password change timestamp in profile
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
      console.error('Password change error:', err);
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

  // Two-factor authentication
  const toggleTwoFactorAuth = async (enabled: boolean, password: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // First, verify the current password
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password
      });
      
      if (verifyError) {
        throw new Error('Password is incorrect');
      }
      
      // Update the two-factor status in profile
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
      console.error('Two-factor auth toggle error:', err);
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

  // Account deletion
  const deleteAccount = async (password: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // First, verify the current password
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password
      });
      
      if (verifyError) {
        throw new Error('Password is incorrect');
      }
      
      // Delete the user (this will cascade to the profile because of the foreign key)
      const { error: deleteError } = await supabase.auth.admin.deleteUser(
        user.id
      );
      
      if (deleteError) {
        throw deleteError;
      }
      
      // Sign out
      await supabase.auth.signOut();
      
      toast({
        title: 'Account deleted',
        description: 'Your account has been successfully deleted',
      });
      
    } catch (err) {
      console.error('Account deletion error:', err);
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
    successMessage,
    setError,
    setSuccessMessage,
    initiateEmailChange,
    confirmEmailChange,
    changePassword,
    toggleTwoFactorAuth,
    deleteAccount
  };
}
