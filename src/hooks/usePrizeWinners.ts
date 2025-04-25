
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PrizeWinner {
  id: string;
  winner_name: string;
  puzzle_name: string;
  puzzle_image_url: string;
  completion_time: number;
  prize_value: number;
  winner_country: string;
  created_at: string;
}

export function usePrizeWinners() {
  const fetchWinners = async (): Promise<PrizeWinner[]> => {
    const today = new Date().toISOString().split('T')[0];
    console.log('Fetching prize winners for date:', today);
    try {
      const { data, error } = await supabase.rpc('get_daily_winners', { date_param: today });
      
      if (error) {
        console.error('Error fetching prize winners:', error);
        throw error;
      }
      
      console.log('Prize winners data received:', data);
      return data || [];
    } catch (err) {
      console.error('Exception in fetchWinners:', err);
      return [];
    }
  };

  const { data, refetch, isLoading, error } = useQuery({
    queryKey: ['prizeWinners'],
    queryFn: fetchWinners,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const channel = supabase
      .channel('prize_winners_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'prize_winners' },
        () => {
          console.log('Prize winners data changed, refetching...');
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return { 
    winners: data || [], 
    isLoading,
    error,
    refetch
  };
}
