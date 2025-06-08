
import React from 'react';
import { render } from '@testing-library/react';
import { RoleBasedAccess } from '../RoleBasedAccess';
import { AuthContext } from '@/contexts/AuthContext';
import type { AuthContextType } from '@/contexts/AuthContext';

const mockAuthContext = (overrides: Partial<AuthContextType> = {}): AuthContextType => ({
  user: null,
  userRole: 'player',
  isAuthenticated: false,
  isLoading: false,
  isAdmin: false,
  session: null,
  error: null,
  rolesLoaded: true,
  hasRole: () => false,
  signUp: async () => ({ error: new Error('Authentication not configured') }),
  signIn: async () => ({ error: new Error('Authentication not configured') }),
  signOut: async () => ({ error: new Error('Authentication not configured') }),
  resetPassword: async () => ({ error: new Error('Authentication not configured') }),
  updatePassword: async () => ({ error: new Error('Authentication not configured') }),
  ...overrides,
});

const renderWithAuth = (component: React.ReactElement, authValue: AuthContextType) => {
  return render(
    <AuthContext.Provider value={authValue}>
      {component}
    </AuthContext.Provider>
  );
};

describe('RoleBasedAccess', () => {
  it('renders content when user has required role', () => {
    const authValue = mockAuthContext({
      user: { id: '1', email: 'test@example.com' },
      isAuthenticated: true,
      userRole: 'admin',
      hasRole: (role: string) => role === 'admin',
    });

    const { getByText } = renderWithAuth(
      <RoleBasedAccess allowedRoles={['admin']}>
        <div>Admin content</div>
      </RoleBasedAccess>,
      authValue
    );

    expect(getByText('Admin content')).toBeInTheDocument();
  });

  it('does not render content when user lacks required role', () => {
    const authValue = mockAuthContext({
      user: { id: '1', email: 'test@example.com' },
      isAuthenticated: true,
      userRole: 'player',
      hasRole: (role: string) => role === 'player',
    });

    const { queryByText } = renderWithAuth(
      <RoleBasedAccess allowedRoles={['admin']}>
        <div>Admin content</div>
      </RoleBasedAccess>,
      authValue
    );

    expect(queryByText('Admin content')).not.toBeInTheDocument();
  });

  it('does not render content when user is not authenticated', () => {
    const authValue = mockAuthContext({
      user: null,
      isAuthenticated: false,
      userRole: 'player',
      hasRole: () => false,
    });

    const { queryByText } = renderWithAuth(
      <RoleBasedAccess allowedRoles={['admin']}>
        <div>Admin content</div>
      </RoleBasedAccess>,
      authValue
    );

    expect(queryByText('Admin content')).not.toBeInTheDocument();
  });
});
