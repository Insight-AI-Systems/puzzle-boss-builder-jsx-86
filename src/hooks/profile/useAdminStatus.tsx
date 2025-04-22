
import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/userTypes';

// Special admin email that should always have access
const PROTECTED_ADMIN_EMAIL = 'alan@insight-ai-systems.com';

export function useAdminStatus(profile: UserProfile | null) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    // Clear admin state if no profile
    if (!profile) {
      setIsAdmin(false);
      return;
    }
    
    // Check profile email (id contains email for profiles)
    const isProtectedAdmin = 
      profile.id === PROTECTED_ADMIN_EMAIL || 
      profile.email === PROTECTED_ADMIN_EMAIL;
    
    // Explicit check for Alan's email with super admin privileges
    if (isProtectedAdmin) {
      console.log('useAdminStatus - Protected super admin detected, granting full admin privileges');
      setIsAdmin(true);
      return;
    }
    
    // Check if the user role is either super_admin or admin
    const hasAdminRole = profile.role === 'super_admin' || profile.role === 'admin';
    setIsAdmin(hasAdminRole);
    
  }, [profile]);

  return { isAdmin };
}
