
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TriviaQuestion, QuizGameState } from '../types/triviaTypes';

export function useTriviaQuizSession() {
  const createQuizSession = useCallback(async (categoryId: string | null, questionCount: number = 10) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Please log in to play trivia');
      return null;
    }

    const { data: session, error: sessionError } = await supabase
      .from('trivia_quiz_sessions')
      .insert({
        user_id: user.id,
        category_id: categoryId,
        total_questions: questionCount,
        current_question: 0,
        score: 0,
        correct_answers: 0,
        time_bonus: 0,
        status: 'active'
      })
      .select()
      .single();

    if (sessionError) throw sessionError;
    return session;
  }, []);

  const updateQuizSession = useCallback(async (sessionId: string, updates: any) => {
    await supabase
      .from('trivia_quiz_sessions')
      .update(updates)
      .eq('id', sessionId);
  }, []);

  const completeQuizSession = useCallback(async (
    sessionId: string,
    finalScore: number,
    finalCorrectAnswers: number,
    finalTimeBonus: number,
    categoryId: string | null,
    totalQuestions: number,
    startTime: number | null
  ) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('trivia_quiz_sessions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        score: finalScore,
        correct_answers: finalCorrectAnswers,
        time_bonus: finalTimeBonus,
      })
      .eq('id', sessionId);

    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single();

    const username = profile?.username || 'Anonymous';
    const totalTime = startTime ? Date.now() - startTime : 0;
    const averageTime = Math.floor(totalTime / totalQuestions);

    await supabase
      .from('trivia_leaderboard')
      .insert({
        user_id: user.id,
        category_id: categoryId,
        username,
        total_score: finalScore,
        correct_answers: finalCorrectAnswers,
        total_questions: totalQuestions,
        average_time: averageTime,
      });

    toast.success(`Quiz completed! Your score: ${finalScore}`);
  }, []);

  const recordAnswer = useCallback(async (sessionId: string, questionId: string, selectedAnswer: string, isCorrect: boolean, timeTaken: number, timeBonus: number) => {
    await supabase
      .from('trivia_quiz_answers')
      .insert({
        session_id: sessionId,
        question_id: questionId,
        selected_answer: selectedAnswer,
        is_correct: isCorrect,
        time_taken: timeTaken,
        time_bonus: timeBonus,
      });
  }, []);

  return {
    createQuizSession,
    updateQuizSession,
    completeQuizSession,
    recordAnswer,
  };
}
