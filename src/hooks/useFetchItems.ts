
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ProgressItem } from '@/types/progressTypes';

export function useFetchItems(savedOrder: string[]) {
  return useQuery({
    queryKey: ['progress-items'],
    queryFn: async () => {
      console.log('Fetching progress items...');
      
      const { data, error } = await supabase
        .from('progress_items')
        .select(`
          *,
          progress_comments (
            *
          )
        `)
        .order('priority', { ascending: false })
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching progress items:', error);
        toast({
          variant: "destructive",
          title: "Error fetching progress items",
          description: error.message,
        });
        return [];
      }

      if (savedOrder.length > 0 && data) {
        const sortedData = [...data].sort((a, b) => {
          const indexA = savedOrder.indexOf(a.id);
          const indexB = savedOrder.indexOf(b.id);
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });
        return sortedData as ProgressItem[];
      }
      
      return data as ProgressItem[] || [];
    },
  });
}
