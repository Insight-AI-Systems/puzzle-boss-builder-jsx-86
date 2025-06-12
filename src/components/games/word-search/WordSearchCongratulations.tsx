
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Clock, Target, AlertTriangle, RotateCcw, Award, X } from 'lucide-react';
import { WordSearchLeaderboard } from './WordSearchLeaderboard';

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
  const isAllWordsFound = wordsFound === totalWords;

  const handleClose = () => {
    onClose();
  };

  const handlePlayAgain = () => {
    onClose();
    onPlayAgain();
  };

  const handleViewLeaderboard = () => {
    onClose();
    onViewLeaderboard();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-center text-2xl text-puzzle-gold flex items-center gap-2">
              <Trophy className="h-6 w-6" />
              {isAllWordsFound ? 'Puzzle Complete!' : 'Game Over'}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Game Results */}
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
                    {timeElapsed.toFixed(2)}s
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
                    You found all words in {timeElapsed.toFixed(2)} seconds
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
                onClick={handlePlayAgain}
                className="flex-1 bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black font-semibold"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Play Again
              </Button>
              
              <Button
                onClick={handleViewLeaderboard}
                variant="outline"
                className="flex-1 border-puzzle-gold text-puzzle-gold hover:bg-puzzle-gold hover:text-puzzle-black"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Full Leaderboard
              </Button>
            </div>
          </div>

          {/* Mini Leaderboard */}
          <div>
            <WordSearchLeaderboard limit={5} showTitle={true} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
