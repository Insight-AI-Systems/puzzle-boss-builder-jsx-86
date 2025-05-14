
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserRole, ROLE_DEFINITIONS } from '@/types/userTypes';
import { useAuthState } from './AuthStateContext';
import { toast } from '@/hooks/use-toast';

// Special admin email that should always have access
const PROTECTED_ADMIN_EMAIL = 'alan@insight-ai-systems.com';

interface RoleContextType {
  userRole: UserRole | null;
  userRoles: string[];
  isAdmin: boolean;
  rolesLoaded: boolean;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  fetchUserRoles: (userId: string) => Promise<void>;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { user, session } = useAuthState();
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [rolesLoaded, setRolesLoaded] = useState(false);
  
  // Use ref to cache hasRole results
  const roleCache = useRef<Record<string, boolean>>({});
  const permissionCache = useRef<Record<string, boolean>>({});

  // Computed value - true if user is super_admin
  const isAdmin = userRole === 'super_admin' || user?.email === PROTECTED_ADMIN_EMAIL;

  // Fetch user roles from the database
  const fetchUserRoles = async (userId: string) => {
    try {
      // Skip if roles are already loaded for this user
      if (rolesLoaded && userRoles.length > 0) {
        console.log('RoleProvider - Roles already loaded, skipping fetch');
        return;
      }

      // Add more debug logging
      console.log('RoleProvider - Debug Info:', {
        fetchingRolesForUserId: userId,
        currentUserEmail: session?.user?.email,
        sessionExists: !!session,
        userExists: !!session?.user
      });
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      console.log('RoleProvider - Profile Query Result:', {
        profile,
        error: profileError ? { code: profileError.code, message: profileError.message } : null
      });

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching user profile:', profileError);
        toast({
          title: "Error Loading Roles",
          description: "Couldn't load user roles. Some features may be unavailable.",
          variant: "destructive"
        });
        return;
      }

      // Special case for super admin email
      if (session?.user?.email === PROTECTED_ADMIN_EMAIL) {
        console.log('RoleProvider - Special super admin email detected');
        setUserRoles(['super_admin']);
        setUserRole('super_admin');
        setRolesLoaded(true);
        // Clear role cache when roles change
        roleCache.current = {};
        permissionCache.current = {};
        return;
      }

      if (profile && profile.role) {
        console.log('RoleProvider - Role found in profile:', profile.role);
        setUserRoles([profile.role]);
        setUserRole(profile.role as UserRole);
        setRolesLoaded(true);
        // Clear role cache when roles change
        roleCache.current = {};
        permissionCache.current = {};
        return;
      }

      // Legacy support for user_roles table
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      console.log('RoleProvider - User Roles Query Result:', {
        roles,
        error: rolesError ? { code: rolesError.code, message: rolesError.message } : null
      });

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        toast({
          title: "Error Loading Roles",
          description: "Couldn't load user roles. Some features may be unavailable.",
          variant: "destructive"
        });
        return;
      }

      if (roles && roles.length > 0) {
        const extractedRoles = roles.map(roleObj => roleObj.role);
        console.log('RoleProvider - Roles found in user_roles table:', extractedRoles);
        setUserRoles(extractedRoles);
        setUserRole(extractedRoles[0] as UserRole);
        setRolesLoaded(true);
        // Clear role cache when roles change
        roleCache.current = {};
        permissionCache.current = {};
      } else {
        console.log('RoleProvider - No roles found, defaulting to player');
        setUserRoles(['player']);
        setUserRole('player');
        setRolesLoaded(true);
        // Clear role cache when roles change
        roleCache.current = {};
        permissionCache.current = {};
      }
    } catch (error) {
      console.error('Error fetching user roles:', error);
      setUserRoles(['player']);
      setUserRole('player');
      setRolesLoaded(true);
      // Clear role cache when roles change
      roleCache.current = {};
      permissionCache.current = {};
      
      toast({
        title: "Error Loading Roles",
        description: "Couldn't load user roles. Default player role assigned.",
        variant: "destructive"
      });
    }
  };

  // Initialize roles when user changes
  useEffect(() => {
    if (session?.user) {
      console.log('RoleProvider - User authenticated, fetching roles');
      fetchUserRoles(session.user.id);
    } else {
      console.log('RoleProvider - User not authenticated, clearing roles');
      setUserRoles([]);
      setUserRole(null);
      setRolesLoaded(false);
      roleCache.current = {};
      permissionCache.current = {};
    }
  }, [session?.user?.id]);

  // Check if user has a specific role
  const hasRole = (role: string): boolean => {
    // Check cache first
    const cacheKey = `${user?.id || 'anonymous'}-${role}`;
    
    if (roleCache.current[cacheKey] !== undefined) {
      console.log(`RoleProvider - Using cached hasRole result for ${role}:`, roleCache.current[cacheKey]);
      return roleCache.current[cacheKey];
    }
    
    // Enhanced debug logging
    console.log('RoleProvider - hasRole check:', {
      requestedRole: role,
      currentUserEmail: user?.email,
      protectedAdminEmail: PROTECTED_ADMIN_EMAIL,
      isProtectedAdmin: user?.email === PROTECTED_ADMIN_EMAIL,
      currentUserRole: userRole,
      availableRoles: userRoles,
      rolesLoaded
    });
    
    // Always give access to the protected admin email
    if (user?.email === PROTECTED_ADMIN_EMAIL) {
      console.log('RoleProvider - Protected admin email detected, granting access');
      roleCache.current[cacheKey] = true;
      return true;
    }
    
    // Super admin can access all roles
    if (userRole === 'super_admin') {
      console.log('RoleProvider - Super admin detected, granting access');
      roleCache.current[cacheKey] = true;
      return true;
    }
    
    // Exact role match
    if (userRole === role) {
      console.log(`RoleProvider - Exact role match: ${userRole} = ${role}`);
      roleCache.current[cacheKey] = true;
      return true;
    }
    
    // Check role array as fallback
    const hasRoleInArray = userRoles.includes(role);
    console.log(`RoleProvider - Role array check: ${role} in [${userRoles.join(', ')}] = ${hasRoleInArray}`);
    
    // Cache result
    roleCache.current[cacheKey] = hasRoleInArray;
    return hasRoleInArray;
  };

  // Check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    // Check cache first
    const cacheKey = `${user?.id || 'anonymous'}-perm-${permission}`;
    
    if (permissionCache.current[cacheKey] !== undefined) {
      return permissionCache.current[cacheKey];
    }
    
    // Super admin has all permissions
    if (isAdmin) {
      permissionCache.current[cacheKey] = true;
      return true;
    }
    
    // Check if user's role has the permission
    const roleDefinition = userRole ? ROLE_DEFINITIONS[userRole as UserRole] : undefined;
    
    if (roleDefinition && roleDefinition.permissions.includes(permission)) {
      permissionCache.current[cacheKey] = true;
      return true;
    }
    
    // Check all user roles for the permission
    const hasPermissionInRoles = userRoles.some(role => {
      const def = ROLE_DEFINITIONS[role as UserRole];
      return def && def.permissions.includes(permission);
    });
    
    permissionCache.current[cacheKey] = hasPermissionInRoles;
    return hasPermissionInRoles;
  };

  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (isAdmin) return true;
    return permissions.some(permission => hasPermission(permission));
  };

  // Check if user has all of the specified permissions
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (isAdmin) return true;
    return permissions.every(permission => hasPermission(permission));
  };

  const value = {
    userRole,
    userRoles,
    isAdmin,
    rolesLoaded,
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    fetchUserRoles,
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
