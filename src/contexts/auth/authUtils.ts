
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ROLES } from '@/utils/permissions';
import { AuthResult, Profile } from './types';
import { User, AuthError } from '@supabase/supabase-js';

/**
 * Fetches a user's profile from the database
 */
export const fetchUserProfile = async (userId: string): Promise<AuthResult<Profile>> => {
  console.log('Fetching user profile for:', userId);
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error fetching profile",
        description: error.message,
        variant: "destructive"
      });
      return { error: { message: error.message } };
    } else {
      console.log('Profile data retrieved:', data);
      return { data: data as Profile };
    }
  } catch (error) {
    const err = error as Error;
    console.error('Exception in fetchUserProfile:', err);
    return { error: { message: err.message } };
  }
};

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

/**
 * Updates a user's profile information
 */
export const updateUserProfile = async (user: User, updates: Partial<Profile>): Promise<AuthResult<Profile>> => {
  console.log('Updating user profile with:', updates);
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select();
    
    if (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Profile update failed",
        description: error.message,
        variant: "destructive"
      });
      return { error: { message: error.message } };
    }
    
    console.log('Profile updated:', data[0]);
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully."
    });
    
    return { data: data[0] as Profile };
  } catch (error) {
    const err = error as Error;
    console.error('Exception in updateUserProfile:', err);
    toast({
      title: "Profile update failed",
      description: err.message,
      variant: "destructive"
    });
    return { error: { message: err.message } };
  }
};
