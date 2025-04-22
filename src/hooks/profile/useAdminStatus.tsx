
import { useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/types/userTypes';

// Special admin email that should always have access
const PROTECTED_ADMIN_EMAIL = 'alan@insight-ai-systems.com';

export function useAdminStatus(profile: UserProfile | null) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (profile) {
      // Enhanced logging for debugging admin status
      console.log('useAdminStatus - Checking admin status');
      console.log('useAdminStatus - Profile:', profile);
      console.log('useAdminStatus - Profile Email:', profile.id);
      console.log('useAdminStatus - Profile Role:', profile.role);
      
      // Explicit check for Alan's email with super admin privileges
      // This takes precedence over any other checks
      if (profile.id === PROTECTED_ADMIN_EMAIL) {
        console.log('useAdminStatus - Protected super admin email detected, granting full admin privileges');
        setIsAdmin(true);
        return;
      }
      
      // Check if the user role is either super_admin or admin
      const hasAdminRole = ['super_admin', 'admin'].includes(profile.role as string);
      console.log('useAdminStatus - Has admin role:', hasAdminRole);
      
      setIsAdmin(hasAdminRole);
    } else {
      setIsAdmin(false);
    }
  }, [profile]);

  return { isAdmin };
}
