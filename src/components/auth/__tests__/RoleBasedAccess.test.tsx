
import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthContext, AuthContextType } from '@/contexts/AuthContext';
import { RoleBasedAccess } from '../RoleBasedAccess';
import { Session, User } from '@supabase/supabase-js';
import { UserRole } from '@/types/userTypes';
import '@testing-library/jest-dom';

// Mock user and session
const mockUser: User = {
  id: 'test-user-id',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: '',
};

const mockSession: Session = {
  access_token: 'test-access-token',
  refresh_token: 'test-refresh-token',
  user: mockUser,
  expires_at: 123456789,
  expires_in: 3600,
  token_type: 'bearer'
};

describe('RoleBasedAccess Component', () => {
  test('renders children when user has required role', () => {
    // Mock auth context with admin role
    const mockAuthContext: AuthContextType = {
      user: mockUser,
      session: mockSession,
      isAuthenticated: true,
      isLoading: false,
      error: null,
      userRole: 'super_admin' as UserRole,
      userRoles: ['super_admin'] as UserRole[],
      hasRole: (role: string) => role === 'super_admin',
      isAdmin: true, // Add missing property
      rolesLoaded: true,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      resetPassword: jest.fn(),
      updatePassword: jest.fn(),
      refreshSession: jest.fn(),
      clearAuthError: jest.fn(),
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <RoleBasedAccess allowedRoles={['super_admin']}>
          <div data-testid="protected-content">Protected Content</div>
        </RoleBasedAccess>
      </AuthContext.Provider>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  test('does not render children when user lacks required role', () => {
    // Mock auth context with player role
    const mockAuthContext: AuthContextType = {
      user: mockUser,
      session: mockSession,
      isAuthenticated: true,
      isLoading: false,
      error: null,
      userRole: 'player' as UserRole,
      userRoles: ['player'] as UserRole[],
      hasRole: (role: string) => role === 'player',
      isAdmin: false, // Add missing property
      rolesLoaded: true,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      resetPassword: jest.fn(),
      updatePassword: jest.fn(),
      refreshSession: jest.fn(),
      clearAuthError: jest.fn(),
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <RoleBasedAccess allowedRoles={['admin']}>
          <div data-testid="protected-content">Protected Content</div>
        </RoleBasedAccess>
      </AuthContext.Provider>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  test('renders children when user has any of the multiple required roles', () => {
    // Mock auth context with custom hasRole implementation
    const mockAuthContext: AuthContextType = {
      user: mockUser,
      session: mockSession,
      isAuthenticated: true,
      isLoading: false,
      error: null,
      userRole: 'admin' as UserRole,
      userRoles: ['admin', 'editor'] as UserRole[],
      hasRole: (testRole: string) => ['admin', 'editor'].includes(testRole),
      isAdmin: false, // Add missing property
      rolesLoaded: true,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      resetPassword: jest.fn(),
      updatePassword: jest.fn(),
      refreshSession: jest.fn(),
      clearAuthError: jest.fn(),
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <RoleBasedAccess allowedRoles={['super_admin', 'admin']}>
          <div data-testid="protected-content">Protected Content</div>
        </RoleBasedAccess>
      </AuthContext.Provider>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });
});
