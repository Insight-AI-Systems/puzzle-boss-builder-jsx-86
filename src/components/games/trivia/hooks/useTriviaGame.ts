
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { QuizGameState } from '../types/triviaTypes';
import { useTriviaCategories } from './useTriviaCategories';
import { useTriviaTimer } from './useTriviaTimer';
import { useTriviaQuizSession } from './useTriviaQuizSession';
import { useTriviaQuestions } from './useTriviaQuestions';

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

  const [loading, setLoading] = useState(false);

  const { categories, loadCategories } = useTriviaCategories();
  const { timeRemaining, setTimeRemaining, startTimer, resetTimer } = useTriviaTimer();
  const { createQuizSession, updateQuizSession, completeQuizSession, recordAnswer } = useTriviaQuizSession();
  const { loadQuestions } = useTriviaQuestions();

  const startQuiz = useCallback(async (categoryId: string | null, questionCount: number = 10) => {
    setLoading(true);
    try {
      const session = await createQuizSession(categoryId, questionCount);
      if (!session) return;

      const selectedQuestions = await loadQuestions(categoryId, questionCount);
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

      startTimer(selectedQuestions[0]?.time_limit || 20);
      toast.success('Quiz started! Good luck!');
    } catch (error) {
      console.error('Error starting quiz:', error);
      toast.error('Failed to start quiz');
    } finally {
      setLoading(false);
    }
  }, [createQuizSession, loadQuestions, startTimer]);

  const submitAnswer = useCallback(async (selectedAnswer: string) => {
    if (!gameState.sessionId || gameState.status !== 'active') return;

    const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
    if (!currentQuestion) return;

    const now = Date.now();
    const timeTaken = gameState.questionStartTime ? now - gameState.questionStartTime : 0;
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    
    const maxTime = currentQuestion.time_limit * 1000;
    const timeBonus = isCorrect ? Math.max(0, Math.floor(100 * (1 - timeTaken / maxTime))) : 0;
    
    const baseScore = isCorrect ? 100 : 0;
    const questionScore = baseScore + timeBonus;

    try {
      await recordAnswer(gameState.sessionId, currentQuestion.id, selectedAnswer, isCorrect, timeTaken, timeBonus);

      const newCorrectAnswers = gameState.correctAnswers + (isCorrect ? 1 : 0);
      const newScore = gameState.score + questionScore;
      const newTimeBonus = gameState.timeBonus + timeBonus;
      const nextQuestionIndex = gameState.currentQuestionIndex + 1;

      if (nextQuestionIndex >= gameState.questions.length) {
        await completeQuizSession(
          gameState.sessionId,
          newScore,
          newCorrectAnswers,
          newTimeBonus,
          gameState.categoryId,
          gameState.questions.length,
          gameState.startTime
        );
        setGameState(prev => ({
          ...prev,
          status: 'completed',
          score: newScore,
          correctAnswers: newCorrectAnswers,
          timeBonus: newTimeBonus,
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          currentQuestionIndex: nextQuestionIndex,
          score: newScore,
          correctAnswers: newCorrectAnswers,
          timeBonus: newTimeBonus,
          questionStartTime: now,
        }));

        startTimer(gameState.questions[nextQuestionIndex]?.time_limit || 20);

        await updateQuizSession(gameState.sessionId, {
          current_question: nextQuestionIndex,
          score: newScore,
          correct_answers: newCorrectAnswers,
          time_bonus: newTimeBonus,
        });
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Failed to submit answer');
    }
  }, [gameState, recordAnswer, completeQuizSession, updateQuizSession, startTimer]);

  const handleTimeUp = useCallback(() => {
    if (gameState.status === 'active') {
      submitAnswer('');
    }
  }, [gameState.status, submitAnswer]);

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
    resetTimer();
  }, [resetTimer]);

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
  }, [gameState.status, timeRemaining, handleTimeUp, setTimeRemaining]);

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
