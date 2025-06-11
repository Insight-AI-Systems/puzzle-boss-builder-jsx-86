
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useRealTimeUserUpdates(enabled: boolean = true) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!enabled) return;

    console.log('📡 Setting up real-time subscription for user updates');
    
    const channel = supabase
      .channel('user-management-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('📡 Real-time user update received:', payload);
          
          // Invalidate and refetch user data
          queryClient.invalidateQueries({ queryKey: ['admin-all-users'] });
          
          // Show notification based on event type
          let message = 'User data has been updated';
          if (payload.eventType === 'INSERT') {
            message = 'New user registered';
          } else if (payload.eventType === 'UPDATE') {
            message = 'User profile updated';
          } else if (payload.eventType === 'DELETE') {
            message = 'User account deleted';
          }
          
          toast({
            title: "Real-time update",
            description: message,
            duration: 3000,
          });
        }
      )
      .subscribe();

    return () => {
      console.log('📡 Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [enabled, queryClient, toast]);

  return null; // This hook doesn't return any data, just manages subscriptions
}
