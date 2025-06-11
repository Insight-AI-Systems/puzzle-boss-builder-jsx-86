
import React from 'react';
import { render } from '@testing-library/react';
import { RoleBasedAccess } from '../RoleBasedAccess';
import { ClerkProvider } from '@clerk/clerk-react';

// Mock the useClerkAuth hook
jest.mock('@/hooks/useClerkAuth', () => ({
  useClerkAuth: () => ({
    user: { id: '1', primaryEmailAddress: { emailAddress: 'test@example.com' } },
    isAuthenticated: true,
    userRole: 'admin',
    hasRole: (role: string) => role === 'admin',
  }),
}));

const renderWithClerk = (component: React.ReactElement) => {
  return render(
    <ClerkProvider publishableKey="test-key">
      {component}
    </ClerkProvider>
  );
};

describe('RoleBasedAccess', () => {
  it('renders content when user has required role', () => {
    const { getByText } = renderWithClerk(
      <RoleBasedAccess allowedRoles={['admin']}>
        <div>Admin content</div>
      </RoleBasedAccess>
    );

    expect(getByText('Admin content')).toBeInTheDocument();
  });

  it('does not render content when user lacks required role', () => {
    // This test would need a different mock
    const { queryByText } = renderWithClerk(
      <RoleBasedAccess allowedRoles={['super_admin']}>
        <div>Super admin content</div>
      </RoleBasedAccess>
    );

    expect(queryByText('Super admin content')).not.toBeInTheDocument();
  });
});
