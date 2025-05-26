
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthState } from './AuthStateContext';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/userTypes';

interface RoleContextType {
  userRole: UserRole | null;
  userRoles: string[];
  isAdmin: boolean;
  hasRole: (role: string) => boolean;
  rolesLoaded: boolean;
  hasPermission: (permission: string) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthState();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [rolesLoaded, setRolesLoaded] = useState(false);

  // Special admin email that should always have access
  const PROTECTED_ADMIN_EMAIL = 'alan@insight-ai-systems.com';

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setUserRole(null);
      setUserRoles([]);
      setRolesLoaded(true);
      return;
    }

    const fetchUserRoles = async () => {
      try {
        // Special case for protected admin email
        if (user.email === PROTECTED_ADMIN_EMAIL) {
          setUserRoles(['super_admin']);
          setUserRole('super_admin');
          setRolesLoaded(true);
          return;
        }

        // Get role from profiles table
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user profile:', error);
          setUserRoles(['player']);
          setUserRole('player');
          setRolesLoaded(true);
          return;
        }

        if (profile && profile.role) {
          setUserRoles([profile.role]);
          setUserRole(profile.role as UserRole);
        } else {
          setUserRoles(['player']);
          setUserRole('player');
        }
        setRolesLoaded(true);
      } catch (error) {
        console.error('Error fetching user roles:', error);
        setUserRoles(['player']);
        setUserRole('player');
        setRolesLoaded(true);
      }
    };

    fetchUserRoles();
  }, [user, isAuthenticated]);

  const hasRole = (role: string): boolean => {
    // Always give access to the protected admin email
    if (user?.email === PROTECTED_ADMIN_EMAIL) {
      return true;
    }
    
    // Super admin can access all roles
    if (userRole === 'super_admin') {
      return true;
    }
    
    // Exact role match
    if (userRole === role) {
      return true;
    }
    
    // Check role array as fallback
    return userRoles.includes(role);
  };

  const hasPermission = (permission: string): boolean => {
    // Always give access to the protected admin email
    if (user?.email === PROTECTED_ADMIN_EMAIL) {
      return true;
    }
    
    // Super admin has all permissions
    if (userRole === 'super_admin') {
      return true;
    }
    
    // Basic permission check (simplified for now)
    return userRole !== null;
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const value: RoleContextType = {
    userRole,
    userRoles,
    isAdmin: userRole === 'super_admin' || user?.email === PROTECTED_ADMIN_EMAIL,
    hasRole,
    rolesLoaded,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRoles() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRoles must be used within a RoleProvider');
  }
  return context;
}
