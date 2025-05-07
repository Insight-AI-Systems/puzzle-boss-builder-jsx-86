
import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/userTypes';
import { isProtectedAdmin, PROTECTED_ADMIN_EMAIL } from '@/constants/securityConfig';

export function useAdminStatus(profile: UserProfile | null) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    // Clear admin state if no profile
    if (!profile) {
      setIsAdmin(false);
      return;
    }
    
    // Check if email matches protected admin (either in profile.email or in profile.id which may contain email)
    const profileEmail = profile.email || profile.id;
    const hasProtectedEmail = isProtectedAdmin(profileEmail);
    
    // Explicit check for protected admin with super admin privileges
    if (hasProtectedEmail) {
      console.log('useAdminStatus - Protected admin detected, granting full admin privileges');
      setIsAdmin(true);
      return;
    }
    
    // Check if the user role is super_admin or admin
    const hasAdminRole = profile.role === 'super_admin' || profile.role === 'admin';
    setIsAdmin(hasAdminRole);
    
    console.log('useAdminStatus check:', { 
      profileId: profile.id, 
      profileEmail, 
      role: profile.role,
      hasProtectedEmail, 
      hasAdminRole, 
      adminStatus: hasProtectedEmail || hasAdminRole 
    });
    
  }, [profile]);

  return { isAdmin };
}
