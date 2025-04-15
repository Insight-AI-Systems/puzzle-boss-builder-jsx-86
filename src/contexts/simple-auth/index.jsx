
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const SimpleAuthContext = createContext(null);

export function SimpleAuthProvider({ children }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('simple_auth_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    }
    setLoading(false);
  }, []);

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('simple_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('simple_auth_user');
    }
  }, [user]);

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Mock credentials check - replace with real auth later
      if (email === 'demo@example.com' && password === 'password') {
        const mockUser = {
          id: '123',
          email,
          role: 'user',
          username: 'Demo User'
        };
        setUser(mockUser);
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in."
        });
        return { user: mockUser, error: null };
      }
      
      throw new Error('Invalid credentials');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error.message
      });
      return { user: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, username) => {
    setLoading(true);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple validation
      if (!email || !password || !username) {
        throw new Error('All fields are required');
      }
      
      // Mock registration - replace with real auth later
      const mockUser = {
        id: Date.now().toString(),
        email,
        username,
        role: 'user'
      };
      setUser(mockUser);
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully."
      });
      return { user: mockUser, error: null };
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message
      });
      return { user: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
      toast({
        title: "Signed out",
        description: "You've been successfully signed out."
      });
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut
  };

  return (
    <SimpleAuthContext.Provider value={value}>
      {children}
    </SimpleAuthContext.Provider>
  );
}

export const useSimpleAuth = () => {
  const context = useContext(SimpleAuthContext);
  if (!context) {
    throw new Error('useSimpleAuth must be used within SimpleAuthProvider');
  }
  return context;
};
