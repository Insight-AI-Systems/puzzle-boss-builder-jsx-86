
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TriviaQuestion } from '../types/triviaTypes';

export function useTriviaQuestions() {
  const loadQuestions = useCallback(async (categoryId: string | null, questionCount: number): Promise<TriviaQuestion[]> => {
    let query = supabase
      .from('trivia_questions')
      .select('*')
      .eq('is_active', true);

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data: allQuestions, error: questionsError } = await query;
    if (questionsError) throw questionsError;

    const shuffled = [...(allQuestions || [])].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, questionCount);

    return selectedQuestions.map(q => ({
      ...q,
      difficulty: q.difficulty as 'easy' | 'medium' | 'hard'
    }));
  }, []);

  return {
    loadQuestions,
  };
}
