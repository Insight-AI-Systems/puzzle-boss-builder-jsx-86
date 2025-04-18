
import { useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/types/userTypes';

export function useAdminStatus(profile: UserProfile | null) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (profile) {
      // Debug logging to help trace role issues
      console.log('useAdminStatus - Checking admin status for role:', profile.role);
      console.log('useAdminStatus - Profile ID:', profile.id);
      
      // Special handling for super_admin
      if (profile.role === 'super_admin') {
        console.log('useAdminStatus - Super admin detected, granting admin privileges');
        setIsAdmin(true);
        return;
      }
      
      // Special handling for specific email addresses
      if (profile.id === 'alan@insight-ai-systems.com') {
        console.log('useAdminStatus - Protected super admin detected via email, granting admin privileges');
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
