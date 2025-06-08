
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TriviaCategories } from './components/TriviaCategories';
import { TriviaQuestionComponent } from './components/TriviaQuestion';
import { TriviaResults } from './components/TriviaResults';
import { useTriviaGame } from './hooks/useTriviaGame';
import { Loader2 } from 'lucide-react';

export function TriviaGame() {
  const {
    gameState,
    categories,
    loading,
    timeRemaining,
    startQuiz,
    submitAnswer,
    resetQuiz,
  } = useTriviaGame();

  const currentQuestion = gameState.questions[gameState.currentQuestionIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <Card className="bg-gray-800 border-gray-700 p-8">
          <CardContent className="flex items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-puzzle-aqua" />
            <span className="text-puzzle-white text-lg">Loading quiz...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="container mx-auto py-8">
        {gameState.status === 'selecting' && (
          <TriviaCategories
            categories={categories}
            onSelectCategory={(categoryId) => startQuiz(categoryId, 10)}
            loading={loading}
          />
        )}

        {gameState.status === 'active' && currentQuestion && (
          <TriviaQuestionComponent
            question={currentQuestion}
            questionNumber={gameState.currentQuestionIndex + 1}
            totalQuestions={gameState.questions.length}
            timeRemaining={timeRemaining}
            onSubmitAnswer={submitAnswer}
            disabled={false}
          />
        )}

        {gameState.status === 'completed' && (
          <TriviaResults
            score={gameState.score}
            correctAnswers={gameState.correctAnswers}
            totalQuestions={gameState.questions.length}
            timeBonus={gameState.timeBonus}
            onPlayAgain={resetQuiz}
            onGoHome={resetQuiz}
          />
        )}
      </div>
    </div>
  );
}
