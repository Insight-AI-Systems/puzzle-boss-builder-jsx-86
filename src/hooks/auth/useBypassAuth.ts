import { useState, useEffect } from 'react';

export const useBypassAuth = () => {
  const [bypassUser, setBypassUser] = useState<any>(null);

  useEffect(() => {
    // Check if bypass mode is enabled
    const checkBypass = () => {
      const bypassEnabled = localStorage.getItem('bypass_auth') === 'true';
      const userStr = localStorage.getItem('bypass_user');
      
      if (bypassEnabled && userStr) {
        try {
          const user = JSON.parse(userStr);
          setBypassUser(user);
        } catch (e) {
          console.error('Failed to parse bypass user:', e);
        }
      } else {
        setBypassUser(null);
      }
    };

    checkBypass();
    
    // Listen for storage changes
    window.addEventListener('storage', checkBypass);
    return () => window.removeEventListener('storage', checkBypass);
  }, []);

  return {
    isInBypassMode: !!bypassUser,
    bypassUser,
    bypassSignOut: () => {
      localStorage.removeItem('bypass_auth');
      localStorage.removeItem('bypass_user');
      setBypassUser(null);
      window.location.href = '/';
    }
  };
};