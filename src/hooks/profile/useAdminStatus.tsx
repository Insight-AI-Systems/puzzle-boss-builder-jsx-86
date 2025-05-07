
import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/userTypes';
import { isProtectedAdmin, PROTECTED_ADMIN_EMAIL } from '@/constants/securityConfig';
import { debugLog, DebugLevel } from '@/utils/debug';

/**
 * Hook to determine if a user has admin privileges
 * 
 * This hook checks multiple conditions for admin status:
 * 1. If the user email matches the protected admin email
 * 2. If the user role is 'admin' or 'super_admin'
 * 
 * @param profile - The user profile object
 * @returns Object containing isAdmin status
 */
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
      debugLog('useAdminStatus', 'Protected admin detected, granting full admin privileges', DebugLevel.INFO, {
        email: profileEmail
      });
      setIsAdmin(true);
      return;
    }
    
    // Check if the user role is super_admin or admin
    const hasAdminRole = profile.role === 'super_admin' || profile.role === 'admin';
    setIsAdmin(hasAdminRole);
    
    debugLog('useAdminStatus', 'Admin status check completed', DebugLevel.INFO, { 
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
