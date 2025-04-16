
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export function useAuthState() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setCurrentUserId(data.session.user.id);
      }
    };
    
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setCurrentUserId(session?.user.id || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { currentUserId };
}

