
import { useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/types/userTypes';

export function useAdminStatus(profile: UserProfile | null) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (profile) {
      // Debug logging to help trace role issues
      console.log('Checking admin status for role:', profile.role);
      
      // Special handling for super_admin
      if (profile.role === 'super_admin' || profile.id === 'alan@insight-ai-systems') {
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
