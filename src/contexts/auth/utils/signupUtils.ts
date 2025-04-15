
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { AuthResult } from '../types';

/**
 * Signs up a new user with email, password and username
 */
export const signUp = async (email: string, password: string, username: string): Promise<AuthResult> => {
  console.log('Attempting signup for:', email);
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
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
      title: "Welcome to The Puzzle Boss!",
      description: "Your account has been created successfully.",
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
