
import { useEffect } from 'react';
import { useClerkAuth } from '@/hooks/useClerkAuth';
import { supabase } from '@/integrations/supabase/client';

export function useActivityTracker() {
  const { user } = useClerkAuth();

  useEffect(() => {
    if (!user) return;

    const trackActivity = async () => {
      try {
        const { error } = await supabase
          .from('user_activity')
          .insert({
            user_id: user.id,
            activity_type: 'page_view',
            timestamp: new Date().toISOString()
          });

        if (error) {
          console.error('Error tracking activity:', error);
        }
      } catch (error) {
        console.error('Activity tracking error:', error);
      }
    };

    trackActivity();
  }, [user]);
}
