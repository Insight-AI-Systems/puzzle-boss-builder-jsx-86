
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
}

export const useHeroPuzzle = () => {
  const [puzzleConfig, setPuzzleConfig] = useState<HeroPuzzleConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchHeroPuzzle = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('hero_puzzle_config')
          .select('*')
          .eq('active', true)
          .limit(1)
          .maybeSingle();
          
        if (error) throw error;
        
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
    
    fetchHeroPuzzle();
  }, [toast]);
  
  return { puzzleConfig, isLoading, error };
};
