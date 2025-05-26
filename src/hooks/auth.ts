
import { useAuthState } from '@/contexts/auth/AuthStateContext';
import { useRoles } from '@/contexts/auth/RoleContext';
import { useAuthOperations } from '@/contexts/auth/AuthOperationsContext';

export function useAuth() {
  const authState = useAuthState();
  const roles = useRoles();
  const authOperations = useAuthOperations();
  
  // Combine all auth-related functionality into a single hook
  return {
    // Auth state
    ...authState,
    
    // Role and permission management
    ...roles,
    
    // Auth operations
    ...authOperations,
  };
}

// Export individual hooks for more targeted usage
export {
  useAuthState,
  useRoles,
  useAuthOperations
};
