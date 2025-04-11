
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch profile data with setTimeout to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId) => {
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
      } else {
        console.log('Profile data retrieved:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('Exception in fetchUserProfile:', error);
    }
  };

  const signUp = async (email, password, username) => {
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
        return { error };
      }

      console.log('Signup successful:', data);
      toast({
        title: "Signup successful!",
        description: "Welcome to The Puzzle Boss. Check your email to confirm your account.",
      });
      
      return { data };
    } catch (error) {
      console.error('Exception in signUp:', error);
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  const signIn = async (email, password) => {
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
        return { error };
      }

      console.log('Login successful:', data);
      toast({
        title: "Login successful!",
        description: "Welcome back to The Puzzle Boss.",
      });
      
      return { data };
    } catch (error) {
      console.error('Exception in signIn:', error);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  const signOut = async () => {
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
        return { error };
      }
      
      console.log('Sign out successful');
      toast({
        title: "Signed out",
        description: "You have been signed out successfully."
      });
      
      return { success: true };
    } catch (error) {
      console.error('Exception in signOut:', error);
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  const resetPassword = async (email) => {
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
        return { error };
      }
      
      console.log('Password reset email sent');
      toast({
        title: "Password reset email sent",
        description: "Check your email for a password reset link."
      });
      
      return { success: true };
    } catch (error) {
      console.error('Exception in resetPassword:', error);
      toast({
        title: "Password reset failed",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };
  
  const updateUserProfile = async (updates) => {
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
        return { error };
      }
      
      console.log('Profile updated:', data[0]);
      setProfile(data[0]);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
      
      return { data: data[0] };
    } catch (error) {
      console.error('Exception in updateUserProfile:', error);
      toast({
        title: "Profile update failed",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateUserProfile,
    isAdmin: profile?.role === 'admin',
    isCategoryManager: profile?.role === 'category_manager',
    isCFO: profile?.role === 'cfo',
    isSocialMediaManager: profile?.role === 'social_media_manager',
    isPartnerManager: profile?.role === 'partner_manager',
    isPlayer: profile?.role === 'player',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
