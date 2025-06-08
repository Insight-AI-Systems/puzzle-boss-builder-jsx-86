
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Zap, Clock, RotateCcw, Home } from 'lucide-react';

interface TriviaResultsProps {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeBonus: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export function TriviaResults({ 
  score, 
  correctAnswers, 
  totalQuestions, 
  timeBonus, 
  onPlayAgain, 
  onGoHome 
}: TriviaResultsProps) {
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
  const baseScore = correctAnswers * 100;

  const getPerformanceMessage = () => {
    if (accuracy >= 90) return { message: "Outstanding! 🌟", color: "text-yellow-400" };
    if (accuracy >= 80) return { message: "Excellent! 🎉", color: "text-green-400" };
    if (accuracy >= 70) return { message: "Good Job! 👍", color: "text-blue-400" };
    if (accuracy >= 50) return { message: "Not Bad! 👌", color: "text-orange-400" };
    return { message: "Keep Practicing! 💪", color: "text-red-400" };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Main Results Card */}
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-puzzle-aqua rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-black" />
            </div>
          </div>
          <CardTitle className="text-3xl text-puzzle-white mb-2">Quiz Complete!</CardTitle>
          <p className={`text-xl font-semibold ${performance.color}`}>
            {performance.message}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="text-center">
            <div className="text-6xl font-bold text-puzzle-aqua mb-2">
              {score.toLocaleString()}
            </div>
            <p className="text-gray-400">Total Score</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-semibold">Accuracy</span>
              </div>
              <div className="text-2xl font-bold text-puzzle-white">{accuracy}%</div>
              <div className="text-sm text-gray-400">
                {correctAnswers} of {totalQuestions} correct
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">Speed Bonus</span>
              </div>
              <div className="text-2xl font-bold text-puzzle-white">
                +{timeBonus.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Bonus points</div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-puzzle-white font-semibold mb-3">Score Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Base Score ({correctAnswers} × 100):</span>
                <span className="text-puzzle-white font-semibold">
                  {baseScore.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Speed Bonus:</span>
                <span className="text-yellow-400 font-semibold">
                  +{timeBonus.toLocaleString()}
                </span>
              </div>
              <div className="border-t border-gray-600 pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-puzzle-white">Total Score:</span>
                  <span className="text-puzzle-aqua">
                    {score.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button 
          onClick={onPlayAgain}
          className="flex-1 bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-black font-semibold"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Play Again
        </Button>
        <Button 
          onClick={onGoHome}
          variant="outline"
          className="flex-1 border-gray-600 text-puzzle-white hover:bg-gray-800"
        >
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>
      </div>

      {/* Performance Badges */}
      <div className="flex justify-center gap-2 flex-wrap">
        {accuracy === 100 && (
          <Badge className="bg-yellow-500 text-black">Perfect Score! 🏆</Badge>
        )}
        {accuracy >= 90 && (
          <Badge className="bg-green-500 text-white">Quiz Master 🎓</Badge>
        )}
        {timeBonus >= 500 && (
          <Badge className="bg-blue-500 text-white">Speed Demon ⚡</Badge>
        )}
        {correctAnswers >= totalQuestions * 0.8 && (
          <Badge className="bg-purple-500 text-white">Knowledge Expert 🧠</Badge>
        )}
      </div>
    </div>
  );
}
