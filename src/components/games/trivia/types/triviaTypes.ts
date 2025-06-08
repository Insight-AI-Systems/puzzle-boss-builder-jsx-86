
export interface TriviaCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TriviaQuestion {
  id: string;
  category_id: string;
  question: string;
  correct_answer: string;
  wrong_answers: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string | null;
  time_limit: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TriviaQuizSession {
  id: string;
  user_id: string;
  category_id: string | null;
  total_questions: number;
  current_question: number;
  score: number;
  correct_answers: number;
  time_bonus: number;
  status: 'active' | 'completed' | 'abandoned';
  started_at: string;
  completed_at: string | null;
  session_data: Record<string, any>;
  created_at: string;
}

export interface TriviaQuizAnswer {
  id: string;
  session_id: string;
  question_id: string;
  selected_answer: string;
  is_correct: boolean;
  time_taken: number;
  time_bonus: number;
  answered_at: string;
}

export interface TriviaLeaderboardEntry {
  id: string;
  user_id: string;
  category_id: string | null;
  username: string;
  total_score: number;
  correct_answers: number;
  total_questions: number;
  average_time: number;
  quiz_date: string;
  created_at: string;
}

export interface QuizGameState {
  sessionId: string | null;
  categoryId: string | null;
  questions: TriviaQuestion[];
  currentQuestionIndex: number;
  score: number;
  correctAnswers: number;
  timeBonus: number;
  status: 'selecting' | 'active' | 'completed';
  startTime: number | null;
  questionStartTime: number | null;
}

export interface QuestionAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeTaken: number;
  timeBonus: number;
}
