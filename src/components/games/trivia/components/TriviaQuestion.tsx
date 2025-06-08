
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TriviaQuestion } from '../types/triviaTypes';
import { Clock, Target, Zap } from 'lucide-react';

interface TriviaQuestionProps {
  question: TriviaQuestion;
  questionNumber: number;
  totalQuestions: number;
  timeRemaining: number;
  onSubmitAnswer: (answer: string) => void;
  disabled: boolean;
}

export function TriviaQuestionComponent({ 
  question, 
  questionNumber, 
  totalQuestions, 
  timeRemaining, 
  onSubmitAnswer,
  disabled 
}: TriviaQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);

  // Shuffle answers when question changes
  useEffect(() => {
    const allAnswers = [question.correct_answer, ...question.wrong_answers];
    const shuffled = [...allAnswers].sort(() => Math.random() - 0.5);
    setAnswers(shuffled);
    setSelectedAnswer(null);
  }, [question]);

  const handleAnswerSelect = (answer: string) => {
    if (disabled || selectedAnswer) return;
    setSelectedAnswer(answer);
    onSubmitAnswer(answer);
  };

  const progressPercent = (timeRemaining / question.time_limit) * 100;
  const isUrgent = timeRemaining <= 5;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-puzzle-aqua border-puzzle-aqua">
            Question {questionNumber} of {totalQuestions}
          </Badge>
          <Badge className={`${getDifficultyColor(question.difficulty)} text-white`}>
            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-puzzle-white">
          <Clock className="w-5 h-5" />
          <span className={`font-bold ${isUrgent ? 'text-red-400' : ''}`}>
            {timeRemaining}s
          </span>
        </div>
      </div>

      {/* Timer Progress */}
      <div className="space-y-2">
        <Progress 
          value={progressPercent} 
          className={`h-3 ${isUrgent ? 'progress-urgent' : ''}`}
        />
        {isUrgent && (
          <p className="text-red-400 text-sm font-medium text-center animate-pulse">
            Time running out!
          </p>
        )}
      </div>

      {/* Question Card */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl text-puzzle-white leading-relaxed">
            {question.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {answers.map((answer, index) => (
              <Button
                key={`${answer}-${index}`}
                variant="outline"
                className={`
                  h-auto p-4 text-left justify-start whitespace-normal
                  border-gray-600 hover:border-puzzle-aqua
                  ${selectedAnswer === answer ? 'border-puzzle-aqua bg-puzzle-aqua/20' : ''}
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}
                `}
                onClick={() => handleAnswerSelect(answer)}
                disabled={disabled}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-puzzle-aqua text-black font-bold flex items-center justify-center flex-shrink-0">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-puzzle-white">{answer}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scoring Info */}
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>Correct Answer: 100 pts</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Speed Bonus: up to 100 pts</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
