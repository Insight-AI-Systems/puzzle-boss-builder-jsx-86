
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ActivityData {
  user_id: string;
  action: string;
  page: string;
  timestamp: string;
}

export const useActivityTracker = (userId?: string) => {
  const trackActivity = async (action: string, page: string) => {
    if (!userId) return;

    try {
      // Since user_activity table doesn't exist, we'll use security_audit_logs instead
      const { error } = await supabase
        .from('security_audit_logs')
        .insert({
          user_id: userId,
          event_type: 'user_activity',
          severity: 'info',
          details: {
            action,
            page,
            timestamp: new Date().toISOString()
          }
        });

      if (error) {
        console.error('Error tracking activity:', error);
      }
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      trackActivity('page_view', window.location.pathname);
    }
  }, [userId]);

  return { trackActivity };
};
