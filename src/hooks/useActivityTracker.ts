
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useActivityTracker() {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Track activity every 5 minutes
    const ACTIVITY_INTERVAL = 5 * 60 * 1000; // 5 minutes

    const updateActivity = async () => {
      try {
        console.log('Activity tracker - Updating last_sign_in for user:', user.id);
        
        const { error } = await supabase
          .from('profiles')
          .update({ last_sign_in: new Date().toISOString() })
          .eq('id', user.id);

        if (error) {
          console.error('Activity tracker - Error updating activity:', error);
        } else {
          console.log('Activity tracker - Successfully updated activity');
        }
      } catch (error) {
        console.error('Activity tracker - Exception:', error);
      }
    };

    // Update activity immediately on mount
    updateActivity();

    // Set up interval for periodic updates
    const intervalId = setInterval(updateActivity, ACTIVITY_INTERVAL);

    // Track user interactions
    const handleUserActivity = () => {
      // Debounce updates to avoid too frequent calls
      clearTimeout(handleUserActivity.timeoutId);
      handleUserActivity.timeoutId = setTimeout(updateActivity, 30000); // 30 seconds
    };

    // Add event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, { passive: true });
    });

    return () => {
      clearInterval(intervalId);
      clearTimeout(handleUserActivity.timeoutId);
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
    };
  }, [isAuthenticated, user]);
}
