import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RoleBasedAccess from '@/components/auth/RoleBasedAccess';
import { createMockAuthContext } from '@/utils/testing/auth/mockAuth';
import { AuthContext } from '@/contexts/AuthContext';

// Mock the authContext
jest.mock('@/contexts/AuthContext', () => ({
  AuthContext: {
    Provider: ({ children }: { children: React.ReactNode }) => children,
    Consumer: ({ children }: { children: Function }) => 
      children(createMockAuthContext(true, 'player'))
  },
  useAuth: () => createMockAuthContext(true, 'player')
}));

// Mock the usePermissions hook
jest.mock('@/hooks/usePermissions', () => ({
  usePermissions: () => ({
    hasPermission: (perm: string) => perm === 'test_permission',
    hasAllPermissions: (perms: string[]) => perms.every(p => p === 'test_permission'),
    hasAnyPermission: (perms: string[]) => perms.some(p => p === 'test_permission')
  })
}));

describe('RoleBasedAccess Component', () => {
  const CONTENT = 'Protected Content';
  const FALLBACK = 'Fallback Content';
  
  it('renders children when no roles or permissions are specified', () => {
    render(
      <RoleBasedAccess>
        <div>{CONTENT}</div>
      </RoleBasedAccess>
    );
    
    expect(screen.getByText(CONTENT)).toBeInTheDocument();
  });
  
  it('renders children when user has required role', () => {
    const mockAuth = {
      ...createMockAuthContext(true, 'admin'),
      hasRole: (role: string) => role === 'admin'
    };
    
    render(
      <AuthContext.Provider value={mockAuth}>
        <RoleBasedAccess allowedRoles={['admin']}>
          <div>{CONTENT}</div>
        </RoleBasedAccess>
      </AuthContext.Provider>
    );
    
    expect(screen.getByText(CONTENT)).toBeInTheDocument();
  });
  
  it('renders fallback when user does not have required role', () => {
    const mockAuth = {
      ...createMockAuthContext(true, 'player'),
      hasRole: (role: string) => role === 'player'
    };
    
    render(
      <AuthContext.Provider value={mockAuth}>
        <RoleBasedAccess 
          allowedRoles={['admin']} 
          fallback={<div>{FALLBACK}</div>}
        >
          <div>{CONTENT}</div>
        </RoleBasedAccess>
      </AuthContext.Provider>
    );
    
    expect(screen.getByText(FALLBACK)).toBeInTheDocument();
    expect(screen.queryByText(CONTENT)).not.toBeInTheDocument();
  });
  
  it('renders children when user has required permission', () => {
    render(
      <RoleBasedAccess requiredPermissions={['test_permission']}>
        <div>{CONTENT}</div>
      </RoleBasedAccess>
    );
    
    expect(screen.getByText(CONTENT)).toBeInTheDocument();
  });
  
  it('renders fallback when user does not have required permission', () => {
    render(
      <RoleBasedAccess 
        requiredPermissions={['missing_permission']} 
        fallback={<div>{FALLBACK}</div>}
      >
        <div>{CONTENT}</div>
      </RoleBasedAccess>
    );
    
    expect(screen.getByText(FALLBACK)).toBeInTheDocument();
    expect(screen.queryByText(CONTENT)).not.toBeInTheDocument();
  });
  
  it('respects requireAllPermissions flag when true', () => {
    render(
      <RoleBasedAccess 
        requiredPermissions={['test_permission', 'missing_permission']} 
        requireAllPermissions={true}
        fallback={<div>{FALLBACK}</div>}
      >
        <div>{CONTENT}</div>
      </RoleBasedAccess>
    );
    
    expect(screen.getByText(FALLBACK)).toBeInTheDocument();
    expect(screen.queryByText(CONTENT)).not.toBeInTheDocument();
  });
  
  it('respects requireAllPermissions flag when false', () => {
    render(
      <RoleBasedAccess 
        requiredPermissions={['test_permission', 'missing_permission']} 
        requireAllPermissions={false}
      >
        <div>{CONTENT}</div>
      </RoleBasedAccess>
    );
    
    expect(screen.getByText(CONTENT)).toBeInTheDocument();
  });
  
  it('renders fallback when user is not authenticated', () => {
    const mockAuth = createMockAuthContext(false);
    
    render(
      <AuthContext.Provider value={mockAuth}>
        <RoleBasedAccess 
          allowedRoles={['player']} 
          fallback={<div>{FALLBACK}</div>}
        >
          <div>{CONTENT}</div>
        </RoleBasedAccess>
      </AuthContext.Provider>
    );
    
    expect(screen.getByText(FALLBACK)).toBeInTheDocument();
    expect(screen.queryByText(CONTENT)).not.toBeInTheDocument();
  });
});
