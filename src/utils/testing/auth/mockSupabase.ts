
import { supabase } from '@/integrations/supabase/client';

export const mockSupabaseClient = () => {
  const originalAuth = { ...supabase.auth };
  
  const authMock = {
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    resetPasswordForEmail: jest.fn(),
    updateUser: jest.fn(),
    getSession: jest.fn(),
    refreshSession: jest.fn(),
    onAuthStateChange: jest.fn(() => ({
      data: { 
        subscription: { 
          unsubscribe: jest.fn(),
          id: 'mock-subscription-id',
          callback: jest.fn()
        } 
      }
    }))
  };
  
  Object.defineProperty(supabase, 'auth', {
    value: authMock,
    writable: true
  });
  
  return () => {
    Object.defineProperty(supabase, 'auth', {
      value: originalAuth,
      writable: true
    });
  };
};
