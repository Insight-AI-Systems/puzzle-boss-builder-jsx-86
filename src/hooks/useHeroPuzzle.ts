
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

  const updateHeroPuzzle = async (puzzleData: Partial<HeroPuzzleConfig>) => {
    try {
      const { error } = await supabase
        .from('hero_puzzle_config')
        .update(puzzleData)
        .eq('id', puzzleData.id);
        
      if (error) throw error;
      
      await fetchHeroPuzzle(); // Refresh the data
      return { success: true };
    } catch (e) {
      console.error('Error updating hero puzzle:', e);
      throw e;
    }
  };

  const createHeroPuzzle = async (puzzleData: Omit<HeroPuzzleConfig, 'id'>) => {
    try {
      // First, set all existing puzzles to inactive
      const { error: updateError } = await supabase
        .from('hero_puzzle_config')
        .update({ active: false })
        .eq('active', true);
        
      if (updateError) throw updateError;
      
      // Then create the new puzzle
      const { error: insertError } = await supabase
        .from('hero_puzzle_config')
        .insert({ ...puzzleData, active: true });
        
      if (insertError) throw insertError;
      
      await fetchHeroPuzzle(); // Refresh the data
      return { success: true };
    } catch (e) {
      console.error('Error creating hero puzzle:', e);
      throw e;
    }
  };
  
  // Set up real-time subscription
  useEffect(() => {
    fetchHeroPuzzle();
    
    const subscription = supabase
      .channel('hero_puzzle_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'hero_puzzle_config' }, 
        fetchHeroPuzzle
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);
  
  return { 
    puzzleConfig, 
    isLoading, 
    error,
    updateHeroPuzzle,
    createHeroPuzzle,
    refetch: fetchHeroPuzzle 
  };
};
