
import { useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/types/userTypes';

export function useAdminStatus(profile: UserProfile | null) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (profile) {
      // Debug logging to help trace role issues
      console.log('Checking admin status for role:', profile.role);
      
      // Force super_admin to always have admin privileges
      if (profile.role === 'super_admin') {
        console.log('Super admin detected, granting admin privileges');
        setIsAdmin(true);
        return;
      }
      
      // Check if the user role is either super_admin or admin
      const hasAdminRole = ['super_admin', 'admin'].includes(profile.role);
      console.log('Has admin role:', hasAdminRole);
      
      setIsAdmin(hasAdminRole);
    } else {
      setIsAdmin(false);
    }
  }, [profile]);

  return { isAdmin };
}
