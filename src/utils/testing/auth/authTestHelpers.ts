
/**
 * Authentication Test Helpers
 * Provides utilities for testing authentication flows
 */
import { supabase } from '@/integrations/supabase/client';
import { cleanup } from '@testing-library/react';
import { Session } from '@supabase/supabase-js';
import { UserRole } from '@/types/userTypes';

// Mock Supabase client for testing
export const mockSupabaseClient = () => {
  // Original implementation to restore later
  const originalAuth = { ...supabase.auth };
  
  // Mock functions
  const authMock = {
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    resetPasswordForEmail: jest.fn(),
    updateUser: jest.fn(),
    getSession: jest.fn(),
    refreshSession: jest.fn(),
    onAuthStateChange: jest.fn(() => ({
      data: { subscription: { unsubscribe: jest.fn() } }
    }))
  };
  
  // Mock the Supabase auth object
  Object.defineProperty(supabase, 'auth', {
    value: authMock,
    writable: true
  });
  
  // Return a cleanup function to restore original implementation
  return () => {
    Object.defineProperty(supabase, 'auth', {
      value: originalAuth,
      writable: true
    });
  };
};

// Set up authentication test environment with a mocked session
export const setupAuthTest = (
  authenticated = true,
  role: UserRole = 'player',
  sessionOverrides = {}
) => {
  const cleanupMock = mockSupabaseClient();
  
  if (authenticated) {
    // Mock session data
    const mockSession: Partial<Session> = {
      access_token: 'test-access-token',
      refresh_token: 'test-refresh-token',
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        user_metadata: { role },
        ...sessionOverrides
      },
      ...sessionOverrides
    };
    
    // Mock getSession to return our test session
    supabase.auth.getSession = jest.fn().mockResolvedValue({
      data: { session: mockSession },
      error: null
    });
    
    // Mock onAuthStateChange to trigger with our test session
    supabase.auth.onAuthStateChange = jest.fn((callback) => {
      // Simulate an auth state change event
      setTimeout(() => callback('SIGNED_IN', mockSession as Session), 0);
      
      // Return a subscription object
      return {
        data: {
          subscription: {
            unsubscribe: jest.fn()
          }
        }
      };
    });
  } else {
    // Mock no session (logged out)
    supabase.auth.getSession = jest.fn().mockResolvedValue({
      data: { session: null },
      error: null
    });
    
    supabase.auth.onAuthStateChange = jest.fn((callback) => {
      // Simulate a signed out state
      setTimeout(() => callback('SIGNED_OUT', null), 0);
      
      // Return a subscription object
      return {
        data: {
          subscription: {
            unsubscribe: jest.fn()
          }
        }
      };
    });
  }
  
  // Return cleanup function
  return () => {
    cleanupMock();
    cleanup();
  };
};

// Helper to simulate login
export const simulateLogin = async (email: string = 'test@example.com', role: UserRole = 'player') => {
  const mockSession: Partial<Session> = {
    access_token: 'test-login-token',
    refresh_token: 'test-refresh-token',
    user: {
      id: 'test-user-id',
      email,
      user_metadata: { role }
    }
  };
  
  // Mock successful login
  supabase.auth.signInWithPassword = jest.fn().mockResolvedValue({
    data: { 
      session: mockSession,
      user: mockSession.user
    },
    error: null
  });
  
  // Trigger auth state change
  const authChangeListeners = 
    (supabase.auth.onAuthStateChange as jest.Mock).mock.calls.map(call => call[0]);
  
  // Call all registered listeners
  authChangeListeners.forEach((listener: any) => {
    if (typeof listener === 'function') {
      listener('SIGNED_IN', mockSession as Session);
    }
  });
  
  // Return mock session for assertions
  return mockSession;
};

// Helper to simulate logout
export const simulateLogout = async () => {
  // Mock successful logout
  supabase.auth.signOut = jest.fn().mockResolvedValue({
    error: null
  });
  
  // Trigger auth state change
  const authChangeListeners = 
    (supabase.auth.onAuthStateChange as jest.Mock).mock.calls.map(call => call[0]);
  
  // Call all registered listeners
  authChangeListeners.forEach((listener: any) => {
    if (typeof listener === 'function') {
      listener('SIGNED_OUT', null);
    }
  });
};

// Mock multiple Auth states in a test
export const withAuthStates = (testFn: (helpers: { 
  asGuest: () => void;
  asUser: (role?: UserRole) => void;
  asAdmin: () => void;
}) => void) => {
  let currentCleanup: (() => void) | null = null;
  
  const helpers = {
    asGuest: () => {
      if (currentCleanup) currentCleanup();
      currentCleanup = setupAuthTest(false);
    },
    asUser: (role: UserRole = 'player') => {
      if (currentCleanup) currentCleanup();
      currentCleanup = setupAuthTest(true, role);
    },
    asAdmin: () => {
      if (currentCleanup) currentCleanup();
      currentCleanup = setupAuthTest(true, 'admin');
    }
  };
  
  // Run the test with our helpers
  testFn(helpers);
  
  // Cleanup after the test
  return () => {
    if (currentCleanup) currentCleanup();
  };
};
