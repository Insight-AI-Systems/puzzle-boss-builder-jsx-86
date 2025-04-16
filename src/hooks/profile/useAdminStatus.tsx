
import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/userTypes';

export function useAdminStatus(profile: UserProfile | null) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (profile) {
      setIsAdmin(profile.role === 'super_admin' || profile.role === 'admin');
    }
  }, [profile]);

  return { isAdmin };
}

