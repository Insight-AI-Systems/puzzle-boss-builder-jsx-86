
import React from 'react';
import { AuthStateProvider } from './AuthStateContext';
import { RoleProvider } from './RoleContext';
import { AuthOperationsProvider } from './AuthOperationsContext';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <AuthStateProvider>
      <RoleProvider>
        <AuthOperationsProvider>
          {children}
        </AuthOperationsProvider>
      </RoleProvider>
    </AuthStateProvider>
  );
}
