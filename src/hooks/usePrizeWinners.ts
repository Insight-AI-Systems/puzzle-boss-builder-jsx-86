
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
    const { data, error } = await supabase.rpc('get_daily_winners', { date_param: today });
    if (error) throw error;
    return data;
  };

  const { data, refetch } = useQuery({
    queryKey: ['prizeWinners'],
    queryFn: fetchWinners,
  });

  useEffect(() => {
    const channel = supabase
      .channel('prize_winners_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'prize_winners' },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return { winners: data || [] };
}
