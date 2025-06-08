

import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@clerk/clerk-react';

export const useHybridAuth = () => {
  const supabaseAuth = useAuth();
  const clerkAuth = useUser();

  // Determine which auth system is active
  const isClerkActive = clerkAuth.isSignedIn;
  const isSupabaseActive = !!supabaseAuth.user && !isClerkActive;

  return {
    // User data
    user: clerkAuth.user || supabaseAuth.user,
    isAuthenticated: clerkAuth.isSignedIn || !!supabaseAuth.user,
    isLoading: clerkAuth.isLoaded === false || supabaseAuth.isLoading,
    
    // Auth system info
    authSystem: isClerkActive ? 'clerk' : isSupabaseActive ? 'supabase' : 'none',
    isClerkActive,
    isSupabaseActive,
    
    // Role checking (prefer Supabase roles for now)
    hasRole: supabaseAuth.hasRole,
    userRole: supabaseAuth.userRole,
    
    // Auth methods (use Supabase for now, can be extended)
    signOut: supabaseAuth.signOut,
  };
};

