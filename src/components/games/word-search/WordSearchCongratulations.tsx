
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Clock, Target, AlertTriangle, RotateCcw, Award } from 'lucide-react';

interface WordSearchCongratulationsProps {
  isOpen: boolean;
  onClose: () => void;
  timeElapsed: number;
  wordsFound: number;
  totalWords: number;
  score: number;
  incorrectSelections: number;
  onPlayAgain: () => void;
  onViewLeaderboard: () => void;
}

export const WordSearchCongratulations: React.FC<WordSearchCongratulationsProps> = ({
  isOpen,
  onClose,
  timeElapsed,
  wordsFound,
  totalWords,
  score,
  incorrectSelections,
  onPlayAgain,
  onViewLeaderboard
}) => {
  const completionTimeSeconds = timeElapsed / 1000;
  const isAllWordsFound = wordsFound === totalWords;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-puzzle-gold flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6" />
            {isAllWordsFound ? 'Puzzle Complete!' : 'Game Over'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Completion Animation */}
          <div className="text-center">
            {isAllWordsFound ? (
              <div className="text-6xl animate-bounce">🎉</div>
            ) : (
              <div className="text-6xl">⏰</div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4 text-center">
                <Clock className="h-6 w-6 mx-auto mb-2 text-puzzle-aqua" />
                <div className="text-xl font-bold text-puzzle-white">
                  {completionTimeSeconds.toFixed(2)}s
                </div>
                <div className="text-xs text-gray-400">Completion Time</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4 text-center">
                <Target className="h-6 w-6 mx-auto mb-2 text-puzzle-gold" />
                <div className="text-xl font-bold text-puzzle-white">
                  {wordsFound}/{totalWords}
                </div>
                <div className="text-xs text-gray-400">Words Found</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4 text-center">
                <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-red-400" />
                <div className="text-xl font-bold text-puzzle-white">
                  {incorrectSelections}
                </div>
                <div className="text-xs text-gray-400">Penalties</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4 text-center">
                <Award className="h-6 w-6 mx-auto mb-2 text-puzzle-gold" />
                <div className="text-xl font-bold text-puzzle-white">
                  {score.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">Final Score</div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Message */}
          <div className="text-center p-4 bg-gray-800 rounded-lg">
            {isAllWordsFound ? (
              <div>
                <p className="text-puzzle-gold font-semibold mb-2">
                  Excellent work! 🌟
                </p>
                <p className="text-gray-300 text-sm">
                  You found all words in {completionTimeSeconds.toFixed(2)} seconds
                  {incorrectSelections === 0 && " with no mistakes!"}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-puzzle-aqua font-semibold mb-2">
                  Time's up! ⏱️
                </p>
                <p className="text-gray-300 text-sm">
                  You found {wordsFound} out of {totalWords} words. Try again to improve!
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onPlayAgain}
              className="flex-1 bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black font-semibold"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Play Again
            </Button>
            
            <Button
              onClick={onViewLeaderboard}
              variant="outline"
              className="flex-1 border-puzzle-gold text-puzzle-gold hover:bg-puzzle-gold hover:text-puzzle-black"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Leaderboard
            </Button>
          </div>

          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full text-gray-400 hover:text-gray-300"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
