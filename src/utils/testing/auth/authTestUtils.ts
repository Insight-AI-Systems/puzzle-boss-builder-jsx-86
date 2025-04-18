
import React from 'react';
import { createMockAuthContext } from './mockAuthContext';
import { mockSupabaseClient } from './mockSupabase';
import { UserRole } from '@/types/userTypes';
import { Session } from '@supabase/supabase-js';

export const setupAuthTest = (
  authenticated = true,
  role: UserRole = 'player',
  sessionOverrides: { user?: Partial<User>, [key: string]: any } = {}
) => {
  const cleanupMock = mockSupabaseClient();
  
  if (authenticated) {
    const mockSession = createMockSession(
      sessionOverrides.user ? { ...createMockUser(), ...sessionOverrides.user } : undefined
    );
    
    supabase.auth.getSession = jest.fn().mockResolvedValue({
      data: { session: mockSession },
      error: null
    });
    
    supabase.auth.onAuthStateChange = jest.fn((callback) => {
      setTimeout(() => callback('SIGNED_IN', mockSession as Session), 0);
      return {
        data: {
          subscription: {
            unsubscribe: jest.fn(),
            id: 'mock-subscription-id',
            callback: jest.fn()
          }
        }
      };
    });
  } else {
    supabase.auth.getSession = jest.fn().mockResolvedValue({
      data: { session: null },
      error: null
    });
    
    supabase.auth.onAuthStateChange = jest.fn((callback) => {
      setTimeout(() => callback('SIGNED_OUT', null), 0);
      return {
        data: {
          subscription: {
            unsubscribe: jest.fn(),
            id: 'mock-subscription-id',
            callback: jest.fn()
          }
        }
      };
    });
  }
  
  return () => {
    cleanupMock();
  };
};

export const createAuthWrapper = (isAuthenticated = true, role: UserRole = 'player') => {
  const mockContext = createMockAuthContext(isAuthenticated, role);
  
  return function(Component: React.ComponentType<any>) {
    return function WrappedComponent(props: any) {
      return React.createElement(Component, { ...props, auth: mockContext });
    };
  };
};

export const simulateLogin = async (email: string = 'test@example.com', role: UserRole = 'player') => {
  const mockUser = createMockUser({ email });
  const mockSession = createMockSession(mockUser);
  
  supabase.auth.signInWithPassword = jest.fn().mockResolvedValue({
    data: { 
      session: mockSession,
      user: mockUser
    },
    error: null
  });
  
  const authChangeListeners = 
    (supabase.auth.onAuthStateChange as jest.Mock).mock.calls.map(call => call[0]);
  
  authChangeListeners.forEach((listener: any) => {
    if (typeof listener === 'function') {
      listener('SIGNED_IN', mockSession);
    }
  });
  
  return mockSession;
};

export const simulateLogout = async () => {
  supabase.auth.signOut = jest.fn().mockResolvedValue({
    error: null
  });
  
  const authChangeListeners = 
    (supabase.auth.onAuthStateChange as jest.Mock).mock.calls.map(call => call[0]);
  
  authChangeListeners.forEach((listener: any) => {
    if (typeof listener === 'function') {
      listener('SIGNED_OUT', null);
    }
  });
};

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
  
  testFn(helpers);
  
  return () => {
    if (currentCleanup) currentCleanup();
  };
};
