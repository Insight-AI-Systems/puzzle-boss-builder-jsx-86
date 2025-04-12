
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { AuthResult, Profile } from '../types';
import { User } from '@supabase/supabase-js';

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
