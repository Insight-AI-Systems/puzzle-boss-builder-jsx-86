
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
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const signUp = async (email, password, username) => {
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
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      toast({
        title: "Signup successful!",
        description: "Welcome to The Puzzle Boss. Check your email to confirm your account.",
      });
      
      return { data };
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }

      toast({
        title: "Login successful!",
        description: "Welcome back to The Puzzle Boss.",
      });
      
      return { data };
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully."
      });
      
      return { success: true };
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for a password reset link."
      });
      
      return { success: true };
    } catch (error) {
      toast({
        title: "Password reset failed",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };
  
  const updateUserProfile = async (updates) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select();
      
      if (error) {
        toast({
          title: "Profile update failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }
      
      setProfile(data[0]);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
      
      return { data: data[0] };
    } catch (error) {
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
