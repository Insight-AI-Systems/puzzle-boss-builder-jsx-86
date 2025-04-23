
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface HeroPuzzleConfig {
  id: string;
  image_url: string;
  difficulty: 'easy' | 'medium' | 'hard';
  active: boolean;
  title: string;
  description: string | null;
  updated_at?: string;
}

export const useHeroPuzzle = () => {
  const [puzzleConfig, setPuzzleConfig] = useState<HeroPuzzleConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchHeroPuzzle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Fetching hero puzzle configuration...");
      const { data, error } = await supabase
        .from('hero_puzzle_config')
        .select('*')
        .eq('active', true)
        .limit(1)
        .maybeSingle();
        
      if (error) throw error;
      
      console.log("Fetched hero puzzle data:", data);
      setPuzzleConfig(data as HeroPuzzleConfig);
    } catch (e) {
      console.error('Error fetching hero puzzle:', e);
      setError(e as Error);
      toast({
        title: "Failed to load puzzle",
        description: "We couldn't load the featured puzzle. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchHeroPuzzle();
    
    // Set up real-time subscription for changes
    const subscription = supabase
      .channel('hero_puzzle_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'hero_puzzle_config' 
        }, 
        () => {
          console.log("Hero puzzle configuration changed, refreshing data");
          fetchHeroPuzzle();
        })
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [toast]);
  
  return { 
    puzzleConfig, 
    isLoading, 
    error,
    refetch: fetchHeroPuzzle 
  };
};
