
import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/userTypes';

export function useAdminStatus(profile: UserProfile | null) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    // Clear admin state if no profile
    if (!profile) {
      setIsAdmin(false);
      return;
    }
    
    // Check if the user role is super_admin or admin
    const hasAdminRole = profile.role === 'super-admin' || profile.role === 'admin';
    setIsAdmin(hasAdminRole);
    
  }, [profile]);

  return { isAdmin };
}
