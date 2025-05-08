
import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/userTypes';
import { adminService } from '@/services/adminService';
import { debugLog, DebugLevel } from '@/utils/debug';
import { isProtectedAdmin } from '@/config/securityConfig';

/**
 * Hook to determine if a user has admin privileges
 * 
 * This hook uses the AdminService to check multiple conditions for admin status:
 * 1. If the user email matches the protected admin email
 * 2. If the user role is 'admin' or 'super_admin'
 * 
 * @param profile - The user profile object
 * @returns Object containing isAdmin status
 */
export function useAdminStatus(profile: UserProfile | null) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);

  useEffect(() => {
    // Clear admin state if no profile
    if (!profile) {
      setIsAdmin(false);
      setIsSuperAdmin(false);
      return;
    }
    
    // Check if protected admin by email
    const hasProtectedEmail = isProtectedAdmin(profile.email || profile.id);
    
    // Explicit check for protected admin with super admin privileges
    if (hasProtectedEmail) {
      debugLog('useAdminStatus', 'Protected admin detected, granting full admin privileges', DebugLevel.INFO, {
        email: profile.email || profile.id
      });
      setIsAdmin(true);
      setIsSuperAdmin(true);
      return;
    }
    
    // Check if the user role is super_admin or admin
    setIsAdmin(adminService.hasAdminRole(profile.role));
    setIsSuperAdmin(profile.role === 'super_admin');
    
    debugLog('useAdminStatus', 'Admin status check completed', DebugLevel.INFO, { 
      profileId: profile.id, 
      profileEmail: profile.email || profile.id, 
      role: profile.role,
      hasProtectedEmail, 
      isAdmin: adminService.hasAdminRole(profile.role),
      isSuperAdmin: profile.role === 'super_admin'
    });
    
  }, [profile]);

  return { isAdmin, isSuperAdmin };
}
