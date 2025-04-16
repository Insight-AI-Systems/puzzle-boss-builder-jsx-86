import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProgressItem } from '@/types/progressTypes';

export function useFetchItems(savedOrder: string[]) {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['progress-items', savedOrder], // Include savedOrder in queryKey to refetch when it changes
    queryFn: async () => {
      console.log('Fetching progress items with saved order of', savedOrder.length, 'items');
      
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

        // Remove duplicate tasks based on title
        if (data && data.length > 0) {
          console.log(`Retrieved ${data.length} items before deduplication`);
          
          // Create a map to keep track of unique titles
          const uniqueTitlesMap = new Map();
          const deduplicatedData = data.filter(item => {
            // If we've seen this title before, skip it
            if (uniqueTitlesMap.has(item.title)) {
              console.log(`Filtering out duplicate: ${item.title}`);
              return false;
            }
            // Otherwise, add it to our map and keep it
            uniqueTitlesMap.set(item.title, true);
            return true;
          });
          
          console.log(`Reduced to ${deduplicatedData.length} unique items`);
          
          // Apply custom sorting if we have a saved order
          if (Array.isArray(savedOrder) && savedOrder.length > 0 && deduplicatedData.length > 0) {
            console.log('Applying manual sorting based on saved order');
            
            // Create a map for O(1) lookup of indices
            const orderMap = new Map(savedOrder.map((id, index) => [id, index]));
            
            // Print out the first few items in saved order
            console.log('Saved order (first 5 items):', savedOrder.slice(0, 5));
            
            // Create a copy of the data and sort it based on the saved order
            const sortedData = [...deduplicatedData].sort((a, b) => {
              const indexA = orderMap.has(a.id) ? orderMap.get(a.id)! : Number.MAX_SAFE_INTEGER;
              const indexB = orderMap.has(b.id) ? orderMap.get(b.id)! : Number.MAX_SAFE_INTEGER;
              
              // Sort based on index in saved order
              return indexA - indexB;
            });
            
            // Print out the first few items after sorting
            console.log('Sorted order (first 5 items):', sortedData.slice(0, 5).map(item => item.title));
            
            console.log('Successfully sorted items based on saved order');
            return sortedData as ProgressItem[];
          }
          
          console.log('No saved order applied, using default sorting');
          return deduplicatedData as ProgressItem[] || [];
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
    staleTime: 30000, // Data stays fresh for 30 seconds to prevent excessive refetching
  });
}
