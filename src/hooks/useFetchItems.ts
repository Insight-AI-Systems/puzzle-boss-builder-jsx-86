
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
      
      try {
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

        // If we have a saved order in localStorage, use it
        if (savedOrder.length > 0 && data) {
          console.log('Using saved order from localStorage');
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
      } catch (e) {
        console.error('Unexpected error in useFetchItems:', e);
        toast({
          variant: "destructive",
          title: "Error loading progress items",
          description: "An unexpected error occurred while loading progress items.",
        });
        return [];
      }
    },
  });
}
