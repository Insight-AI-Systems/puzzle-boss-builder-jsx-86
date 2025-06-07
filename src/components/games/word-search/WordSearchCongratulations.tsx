
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Crown, Star, Zap, Medal, Target } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WordSearchCongratulationsProps {
  score: number;
  timeElapsed: number;
  wordsFound: number;
  totalWords: number;
  difficulty: 'rookie' | 'pro' | 'master';
  onContinue: () => void;
}

export function WordSearchCongratulations({
  score,
  timeElapsed,
  wordsFound,
  totalWords,
  difficulty,
  onContinue
}: WordSearchCongratulationsProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Trigger confetti animation
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      }));
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      }));
    }, 250);

    // Show content after a brief delay
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    return () => {
      clearInterval(interval);
      clearTimeout(contentTimer);
    };
  }, []);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'master': return 'text-purple-400 bg-purple-500';
      case 'pro': return 'text-blue-400 bg-blue-500';
      default: return 'text-green-400 bg-green-500';
    }
  };

  const getDifficultyIcon = () => {
    switch (difficulty) {
      case 'master': return Crown;
      case 'pro': return Medal;
      default: return Star;
    }
  };

  const DifficultyIcon = getDifficultyIcon();

  return (
    <div className="fixed inset-0 bg-puzzle-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`transform transition-all duration-1000 ${showContent ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
        <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-puzzle-aqua border-2 max-w-2xl w-full">
          <CardContent className="p-8 text-center space-y-6">
            {/* Main Trophy */}
            <div className="relative">
              <div className="absolute inset-0 bg-puzzle-gold/20 rounded-full blur-3xl"></div>
              <Trophy className="h-24 w-24 text-puzzle-gold mx-auto relative animate-bounce" />
            </div>

            {/* Congratulations Text */}
            <div className="space-y-2">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-puzzle-gold via-puzzle-aqua to-puzzle-gold bg-clip-text text-transparent animate-pulse">
                CONGRATULATIONS!
              </h1>
              <p className="text-xl text-puzzle-white">
                You completed the Word Search puzzle!
              </p>
            </div>

            {/* Difficulty Badge */}
            <div className="flex justify-center">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getDifficultyColor()}/20 border border-current`}>
                <DifficultyIcon className={`h-5 w-5 ${getDifficultyColor().split(' ')[0]}`} />
                <span className={`font-semibold ${getDifficultyColor().split(' ')[0]} capitalize`}>
                  {difficulty} Level
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
              <div className="bg-puzzle-aqua/10 rounded-lg p-4 border border-puzzle-aqua/30">
                <Zap className="h-6 w-6 text-puzzle-aqua mx-auto mb-2" />
                <div className="text-2xl font-bold text-puzzle-aqua">{score}</div>
                <div className="text-sm text-gray-400">Score</div>
              </div>
              
              <div className="bg-puzzle-gold/10 rounded-lg p-4 border border-puzzle-gold/30">
                <Target className="h-6 w-6 text-puzzle-gold mx-auto mb-2" />
                <div className="text-2xl font-bold text-puzzle-gold">{wordsFound}/{totalWords}</div>
                <div className="text-sm text-gray-400">Words Found</div>
              </div>
              
              <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                <Trophy className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-400">{formatTime(timeElapsed)}</div>
                <div className="text-sm text-gray-400">Time</div>
              </div>
              
              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                <Star className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-400">100%</div>
                <div className="text-sm text-gray-400">Complete</div>
              </div>
            </div>

            {/* Achievement Message */}
            <div className="bg-gradient-to-r from-puzzle-aqua/10 to-puzzle-gold/10 rounded-lg p-4 border border-puzzle-aqua/30">
              <p className="text-puzzle-white font-medium">
                🎉 Amazing work! You found all words in record time!
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Your score has been submitted to the leaderboard
              </p>
            </div>

            {/* Continue Button */}
            <Button
              onClick={onContinue}
              size="lg"
              className="bg-gradient-to-r from-puzzle-aqua to-puzzle-gold hover:from-puzzle-aqua/80 hover:to-puzzle-gold/80 text-puzzle-black font-bold px-8 py-3 text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              View Leaderboard
            </Button>

            {/* Decorative Elements */}
            <div className="absolute top-4 left-4 text-puzzle-gold animate-spin">
              <Star className="h-6 w-6" />
            </div>
            <div className="absolute top-4 right-4 text-puzzle-aqua animate-spin" style={{ animationDirection: 'reverse' }}>
              <Star className="h-6 w-6" />
            </div>
            <div className="absolute bottom-4 left-8 text-puzzle-gold animate-bounce">
              <Zap className="h-4 w-4" />
            </div>
            <div className="absolute bottom-4 right-8 text-puzzle-aqua animate-bounce" style={{ animationDelay: '0.5s' }}>
              <Zap className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
