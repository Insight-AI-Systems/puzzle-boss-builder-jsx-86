
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { AuthResult } from '../types';

/**
 * Signs in a user with email and password
 */
export const signIn = async (email: string, password: string): Promise<AuthResult> => {
  console.log('Attempting login for:', email);
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Login error:', error);
      // Provide more specific error messages
      let errorMessage = error.message;
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = "Email or password is incorrect. Please try again.";
      }
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive"
      });
      return { error: { message: errorMessage } };
    }

    console.log('Login successful:', data);
    toast({
      title: "Login successful!",
      description: "Welcome back to The Puzzle Boss.",
    });
    
    return { data };
  } catch (error) {
    const err = error as Error;
    console.error('Exception in signIn:', err);
    toast({
      title: "Login failed",
      description: err.message,
      variant: "destructive"
    });
    return { error: { message: err.message } };
  }
};

/**
 * Signs out the current user
 */
export const signOut = async (): Promise<AuthResult> => {
  console.log('Attempting to sign out');
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive"
      });
      return { error: { message: error.message } };
    }
    
    console.log('Sign out successful');
    toast({
      title: "Signed out",
      description: "You have been signed out successfully."
    });
    
    return { success: true };
  } catch (error) {
    const err = error as Error;
    console.error('Exception in signOut:', err);
    toast({
      title: "Sign out failed",
      description: err.message,
      variant: "destructive"
    });
    return { error: { message: err.message } };
  }
};
