
import { createMockUser, createMockSession } from './mockData';
import { UserRole } from '@/types/userTypes';

export const createMockAuthContext = (
  isAuthenticated = true,
  role: UserRole = 'player',
  permissions: string[] = []
) => {
  const user = isAuthenticated ? createMockUser() : null;
  const session = isAuthenticated ? createMockSession(user) : null;
  
  // Add isAdmin property based on role
  const isAdmin = role === 'super_admin';
  
  return {
    user,
    session,
    isAuthenticated,
    isLoading: false,
    error: null,
    userRole: role,
    userRoles: [role],
    hasRole: (testRole: string) => role === testRole || role === 'super_admin',
    isAdmin,
    rolesLoaded: true,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    resetPassword: jest.fn(),
    updatePassword: jest.fn(),
    refreshSession: jest.fn(),
    clearAuthError: jest.fn()
  };
};
