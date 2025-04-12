
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ROLES } from '@/utils/permissions';
import { AuthResult } from '../types';

/**
 * Signs up a new user
 */
export const signUp = async (email: string, password: string, username: string): Promise<AuthResult> => {
  console.log('Attempting signup for:', email);
  try {
    // Check if email already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking existing username:', checkError);
    }
    
    if (existingUsers) {
      toast({
        title: "Username already taken",
        description: "Please choose a different username",
        variant: "destructive"
      });
      return { error: { message: "Username already taken" } };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          role: ROLES.PLAYER // Default role for new users
        }
      }
    });

    if (error) {
      console.error('Signup error:', error);
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive"
      });
      return { error: { message: error.message } };
    }

    console.log('Signup successful:', data);
    toast({
      title: "Signup successful!",
      description: "Welcome to The Puzzle Boss. Check your email to confirm your account.",
    });
    
    return { data };
  } catch (error) {
    const err = error as Error;
    console.error('Exception in signUp:', err);
    toast({
      title: "Signup failed",
      description: err.message,
      variant: "destructive"
    });
    return { error: { message: err.message } };
  }
};
