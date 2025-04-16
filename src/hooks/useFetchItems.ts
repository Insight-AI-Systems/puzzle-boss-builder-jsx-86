
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProgressItem } from '@/types/progressTypes';

export function useFetchItems(savedOrder: string[]) {
  const { toast } = useToast();
  
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
        .order('order_index', { ascending: true })
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

      // If we have a saved order in localStorage, use it as a fallback
      if (savedOrder.length > 0 && data) {
        // First check if any items have order_index as null or undefined
        const hasNullOrderIndex = data.some(item => item.order_index === null || item.order_index === undefined);
        
        if (hasNullOrderIndex) {
          // If there are items with null order_index, use the saved order as fallback
          console.log('Using saved order from localStorage as fallback');
          const sortedData = [...data].sort((a, b) => {
            const indexA = savedOrder.indexOf(a.id);
            const indexB = savedOrder.indexOf(b.id);
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
          });
          return sortedData as ProgressItem[];
        }
      }
      
      return data as ProgressItem[] || [];
    },
  });
}
