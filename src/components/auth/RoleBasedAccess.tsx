
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/userTypes';

interface RoleBasedAccessProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export function RoleBasedAccess({ allowedRoles, children }: RoleBasedAccessProps) {
  const { hasRole } = useAuth();

  const hasRequiredRole = allowedRoles.some(role => hasRole(role));

  if (!hasRequiredRole) {
    return null;
  }

  return <>{children}</>;
}
