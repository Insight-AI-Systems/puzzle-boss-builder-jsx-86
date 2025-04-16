
import { useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/types/userTypes';

export function useAdminStatus(profile: UserProfile | null) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (profile) {
      // Check if the user role is either super_admin or admin
      setIsAdmin(['super_admin', 'admin'].includes(profile.role));
    } else {
      setIsAdmin(false);
    }
  }, [profile]);

  return { isAdmin };
}
