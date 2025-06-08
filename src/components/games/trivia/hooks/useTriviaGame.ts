
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { QuizGameState, TriviaQuestion, TriviaCategory, QuestionAnswer, TriviaQuizSession } from '../types/triviaTypes';

export function useTriviaGame() {
  const [gameState, setGameState] = useState<QuizGameState>({
    sessionId: null,
    categoryId: null,
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    correctAnswers: 0,
    timeBonus: 0,
    status: 'selecting',
    startTime: null,
    questionStartTime: null,
  });

  const [categories, setCategories] = useState<TriviaCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Load categories
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

  // Start a new quiz
  const startQuiz = useCallback(async (categoryId: string | null, questionCount: number = 10) => {
    setLoading(true);
    try {
      // Get user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to play trivia');
        return;
      }

      // Create quiz session
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

      // Get random questions
      let query = supabase
        .from('trivia_questions')
        .select('*')
        .eq('is_active', true);

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data: allQuestions, error: questionsError } = await query;
      if (questionsError) throw questionsError;

      // Randomize and limit questions
      const shuffled = [...(allQuestions || [])].sort(() => Math.random() - 0.5);
      const selectedQuestions = shuffled.slice(0, questionCount);

      if (selectedQuestions.length === 0) {
        toast.error('No questions available for this category');
        return;
      }

      const now = Date.now();
      setGameState({
        sessionId: session.id,
        categoryId,
        questions: selectedQuestions,
        currentQuestionIndex: 0,
        score: 0,
        correctAnswers: 0,
        timeBonus: 0,
        status: 'active',
        startTime: now,
        questionStartTime: now,
      });

      setTimeRemaining(selectedQuestions[0]?.time_limit || 20);
      toast.success('Quiz started! Good luck!');
    } catch (error) {
      console.error('Error starting quiz:', error);
      toast.error('Failed to start quiz');
    } finally {
      setLoading(false);
    }
  }, []);

  // Submit an answer
  const submitAnswer = useCallback(async (selectedAnswer: string) => {
    if (!gameState.sessionId || gameState.status !== 'active') return;

    const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
    if (!currentQuestion) return;

    const now = Date.now();
    const timeTaken = gameState.questionStartTime ? now - gameState.questionStartTime : 0;
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    
    // Calculate time bonus (max 100 points for instant answer, decreasing over time)
    const maxTime = currentQuestion.time_limit * 1000; // Convert to milliseconds
    const timeBonus = isCorrect ? Math.max(0, Math.floor(100 * (1 - timeTaken / maxTime))) : 0;
    
    const baseScore = isCorrect ? 100 : 0;
    const questionScore = baseScore + timeBonus;

    try {
      // Record the answer
      await supabase
        .from('trivia_quiz_answers')
        .insert({
          session_id: gameState.sessionId,
          question_id: currentQuestion.id,
          selected_answer: selectedAnswer,
          is_correct: isCorrect,
          time_taken: timeTaken,
          time_bonus: timeBonus,
        });

      const newCorrectAnswers = gameState.correctAnswers + (isCorrect ? 1 : 0);
      const newScore = gameState.score + questionScore;
      const newTimeBonus = gameState.timeBonus + timeBonus;
      const nextQuestionIndex = gameState.currentQuestionIndex + 1;

      // Check if quiz is complete
      if (nextQuestionIndex >= gameState.questions.length) {
        await completeQuiz(newScore, newCorrectAnswers, newTimeBonus);
      } else {
        // Move to next question
        setGameState(prev => ({
          ...prev,
          currentQuestionIndex: nextQuestionIndex,
          score: newScore,
          correctAnswers: newCorrectAnswers,
          timeBonus: newTimeBonus,
          questionStartTime: now,
        }));

        setTimeRemaining(gameState.questions[nextQuestionIndex]?.time_limit || 20);

        // Update session
        await supabase
          .from('trivia_quiz_sessions')
          .update({
            current_question: nextQuestionIndex,
            score: newScore,
            correct_answers: newCorrectAnswers,
            time_bonus: newTimeBonus,
          })
          .eq('id', gameState.sessionId);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Failed to submit answer');
    }
  }, [gameState]);

  // Complete the quiz
  const completeQuiz = useCallback(async (finalScore: number, finalCorrectAnswers: number, finalTimeBonus: number) => {
    if (!gameState.sessionId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Update session as completed
      await supabase
        .from('trivia_quiz_sessions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          score: finalScore,
          correct_answers: finalCorrectAnswers,
          time_bonus: finalTimeBonus,
        })
        .eq('id', gameState.sessionId);

      // Get username
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      const username = profile?.username || 'Anonymous';

      // Calculate average time
      const totalTime = gameState.startTime ? Date.now() - gameState.startTime : 0;
      const averageTime = Math.floor(totalTime / gameState.questions.length);

      // Add to leaderboard
      await supabase
        .from('trivia_leaderboard')
        .insert({
          user_id: user.id,
          category_id: gameState.categoryId,
          username,
          total_score: finalScore,
          correct_answers: finalCorrectAnswers,
          total_questions: gameState.questions.length,
          average_time: averageTime,
        });

      setGameState(prev => ({
        ...prev,
        status: 'completed',
        score: finalScore,
        correctAnswers: finalCorrectAnswers,
        timeBonus: finalTimeBonus,
      }));

      toast.success(`Quiz completed! Your score: ${finalScore}`);
    } catch (error) {
      console.error('Error completing quiz:', error);
      toast.error('Failed to complete quiz');
    }
  }, [gameState]);

  // Handle time up
  const handleTimeUp = useCallback(() => {
    if (gameState.status === 'active') {
      submitAnswer(''); // Submit empty answer when time runs out
    }
  }, [gameState.status, submitAnswer]);

  // Reset quiz
  const resetQuiz = useCallback(() => {
    setGameState({
      sessionId: null,
      categoryId: null,
      questions: [],
      currentQuestionIndex: 0,
      score: 0,
      correctAnswers: 0,
      timeBonus: 0,
      status: 'selecting',
      startTime: null,
      questionStartTime: null,
    });
    setTimeRemaining(0);
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameState.status !== 'active' || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.status, timeRemaining, handleTimeUp]);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    gameState,
    categories,
    loading,
    timeRemaining,
    startQuiz,
    submitAnswer,
    resetQuiz,
    loadCategories,
  };
}
