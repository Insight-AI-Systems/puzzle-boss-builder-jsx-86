
import { createMockUser, createMockSession } from './mockData';
import { UserRole } from '@/types/userTypes';

export const createMockAuthContext = (
  isAuthenticated = true,
  role: UserRole = 'player',
  permissions: string[] = []
) => {
  const user = isAuthenticated ? createMockUser() : null;
  const session = isAuthenticated ? createMockSession(user) : null;
  
  return {
    user,
    session,
    isAuthenticated,
    isLoading: false,
    error: null,
    userRole: role,
    hasRole: (testRole: string) => role === testRole || role === 'super_admin' || (role === 'admin' && testRole !== 'super_admin'),
    isAdmin: role === 'admin' || role === 'super_admin',
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    resetPassword: jest.fn(),
    updatePassword: jest.fn(),
    refreshSession: jest.fn(),
    clearAuthError: jest.fn()
  };
};
