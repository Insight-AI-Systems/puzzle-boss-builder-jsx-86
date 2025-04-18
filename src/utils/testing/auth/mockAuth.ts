
/**
 * Authentication Testing Utilities
 * Provides mock functions and utilities for testing authentication
 */
import React from 'react';
import { Session, User } from '@supabase/supabase-js';
import { UserRole } from '@/types/userTypes';

// Mock user object for testing
export const createMockUser = (overrides = {}): User => {
  return {
    id: 'test-user-id',
    email: 'test@example.com',
    created_at: new Date().toISOString(),
    app_metadata: {},
    user_metadata: {
      username: 'TestUser',
      avatar_url: null
    },
    aud: 'authenticated',
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    role: '',
    updated_at: new Date().toISOString(),
    ...overrides
  };
};

// Mock session object for testing
export const createMockSession = (user = createMockUser()): Session => {
  return {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: 'bearer',
    user
  };
};

// Mock user profile for testing
export const createMockUserProfile = (role: UserRole = 'player', overrides = {}): any => {
  return {
    id: 'test-user-id',
    username: 'TestUser',
    display_name: 'Test User',
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    credits: 0,
    role,
    bio: null,
    email_change_token: null,
    email_change_token_expires_at: null,
    email_change_new_email: null,
    last_sign_in: null,
    active_sessions: [],
    two_factor_enabled: false,
    security_questions: null,
    account_locked: false,
    failed_login_attempts: 0,
    last_password_change: null,
    ...overrides
  };
};

// Mock permissions for testing
export const createMockPermissions = (permissions: string[] = []): string[] => {
  return permissions;
};

// Mock hook context for useAuth
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

// Create a mock component for testing protected routes
export const createAuthWrapper = (isAuthenticated = true, role: UserRole = 'player') => {
  const mockContext = createMockAuthContext(isAuthenticated, role);
  
  // Return a HOC (Higher Order Component) that wraps around the component to be tested
  return function(Component: React.ComponentType<any>) {
    return function WrappedComponent(props: any) {
      return React.createElement(Component, { ...props, auth: mockContext });
    };
  };
};
