
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { UserRole } from '@/types/userTypes';

export function usePermissions() {
  const { user, isAdmin } = useAuth();

  // Fetch all permissions for the current user
  const { data: userPermissions, isLoading } = useQuery({
    queryKey: ['userPermissions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Option 1: Direct database check using role-permission relationship
      const { data: permissions, error } = await supabase
        .from('permissions')
        .select(`
          name,
          description,
          role_permissions!inner(role)
        `)
        .eq('role_permissions.role', user.role);
      
      if (error) throw error;
      
      // Extract permission names from the results
      return permissions.map(p => p.name);
    },
    enabled: !!user,
  });

  // Check if user has a specific permission
  const hasPermission = (permissionName: string): boolean => {
    if (!user) return false;
    if (isAdmin) return true; // Admins have all permissions
    return userPermissions?.includes(permissionName) || false;
  };

  // Check if user has any of the permissions
  const hasAnyPermission = (permissionNames: string[]): boolean => {
    if (!user) return false;
    if (isAdmin) return true;
    return permissionNames.some(name => userPermissions?.includes(name));
  };

  // Check if user has all of the permissions
  const hasAllPermissions = (permissionNames: string[]): boolean => {
    if (!user) return false;
    if (isAdmin) return true;
    return permissionNames.every(name => userPermissions?.includes(name));
  };

  return {
    userPermissions,
    isLoading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  };
}
