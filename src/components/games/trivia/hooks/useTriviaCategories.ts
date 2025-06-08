
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TriviaCategory } from '../types/triviaTypes';

export function useTriviaCategories() {
  const [categories, setCategories] = useState<TriviaCategory[]>([]);

  const loadCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('trivia_categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Failed to load trivia categories');
    }
  }, []);

  return {
    categories,
    loadCategories,
  };
}
