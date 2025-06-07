
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Sparkles, Clock, Target, Award, RotateCcw, Home } from 'lucide-react';

interface GameStats {
  score?: number;
  timeElapsed?: number;
  moves?: number;
  wordsFound?: number;
  totalWords?: number;
  accuracy?: number;
  difficulty?: string;
  gameType?: string;
}

interface GameCongratulationsScreenProps {
  show: boolean;
  stats: GameStats;
  onPlayAgain: () => void;
  onBackToMenu?: () => void;
  onClose?: () => void;
}

const CONFETTI_COLORS = [
  '#ffd700', // gold
  '#00e5ff', // aqua
  '#ff5f91', // magenta
  '#d946ef', // purple
  '#fff',    // white
  '#8B5CF6', // violet
  '#F97316', // orange
  '#10b981', // emerald
];

const CELEBRATION_MESSAGES = [
  "SPECTACULAR!",
  "AMAZING!",
  "FANTASTIC!",
  "INCREDIBLE!",
  "OUTSTANDING!",
  "BRILLIANT!",
  "PHENOMENAL!",
  "MAGNIFICENT!"
];

export function GameCongratulationsScreen({
  show,
  stats,
  onPlayAgain,
  onBackToMenu,
  onClose
}: GameCongratulationsScreenProps) {
  const [celebrationMessage] = useState(() => 
    CELEBRATION_MESSAGES[Math.floor(Math.random() * CELEBRATION_MESSAGES.length)]
  );
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    if (show) {
      // Trigger sound effect if available
      try {
        const audio = new Audio('/sounds/complete.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {
          // Silently fail if audio can't play
        });
      } catch (error) {
        // Silently handle audio errors
      }

      // Show stats after initial animation
      const timer = setTimeout(() => setShowStats(true), 800);
      return () => clearTimeout(timer);
    } else {
      setShowStats(false);
    }
  }, [show]);

  if (!show) return null;

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getPerformanceColor = () => {
    if (stats.accuracy && stats.accuracy > 90) return 'text-emerald-400';
    if (stats.accuracy && stats.accuracy > 75) return 'text-puzzle-gold';
    return 'text-puzzle-aqua';
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
        {/* Animated Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Confetti Animation */}
          {[...Array(50)].map((_, i) => {
            const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
            const delay = Math.random() * 2000;
            const duration = 3000 + Math.random() * 2000;
            
            return (
              <div
                key={`confetti-${i}`}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-10px`,
                  width: `${4 + Math.random() * 8}px`,
                  height: `${4 + Math.random() * 8}px`,
                  backgroundColor: color,
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                  animationDelay: `${delay}ms`,
                  animationDuration: `${duration}ms`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  animation: `confetti-fall ${duration}ms ${delay}ms ease-out forwards`,
                }}
              />
            );
          })}
          
          {/* Sparkle Effects */}
          {[...Array(20)].map((_, i) => (
            <Sparkles
              key={`sparkle-${i}`}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 95}%`,
                top: `${Math.random() * 95}%`,
                width: `${16 + Math.random() * 24}px`,
                height: `${16 + Math.random() * 24}px`,
                color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
                animationDelay: `${Math.random() * 3000}ms`,
                animationDuration: `${2000 + Math.random() * 2000}ms`,
              }}
            />
          ))}
        </div>

        {/* Main Congratulations Card */}
        <Card className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-puzzle-gold border-2 shadow-2xl animate-scale-in max-w-2xl mx-4">
          <CardContent className="p-8 text-center">
            {/* Main Title */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Trophy className="w-12 h-12 text-puzzle-gold animate-bounce" />
                <Star className="w-8 h-8 text-puzzle-aqua animate-pulse" />
                <Trophy className="w-12 h-12 text-puzzle-gold animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
              
              <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-puzzle-gold via-puzzle-aqua to-puzzle-gold mb-2 animate-pulse">
                TAAADAAAA!!!
              </h1>
              
              <h2 className="text-3xl md:text-4xl font-bold text-puzzle-white mb-2">
                {celebrationMessage}
              </h2>
              
              <p className="text-xl text-puzzle-aqua font-semibold">
                🎉 Game Complete! 🎉
              </p>
            </div>

            {/* Game Stats */}
            {showStats && (
              <div className="mb-8 animate-fade-in">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {stats.score !== undefined && (
                    <div className="bg-puzzle-gold/20 rounded-lg p-4 border border-puzzle-gold/30">
                      <Award className="w-6 h-6 text-puzzle-gold mx-auto mb-2" />
                      <div className="text-2xl font-bold text-puzzle-gold">
                        {stats.score.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-300">Score</div>
                    </div>
                  )}
                  
                  {stats.timeElapsed !== undefined && (
                    <div className="bg-puzzle-aqua/20 rounded-lg p-4 border border-puzzle-aqua/30">
                      <Clock className="w-6 h-6 text-puzzle-aqua mx-auto mb-2" />
                      <div className="text-2xl font-bold text-puzzle-aqua">
                        {formatTime(stats.timeElapsed)}
                      </div>
                      <div className="text-sm text-gray-300">Time</div>
                    </div>
                  )}
                  
                  {stats.moves !== undefined && (
                    <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-500/30">
                      <Target className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-400">
                        {stats.moves}
                      </div>
                      <div className="text-sm text-gray-300">Moves</div>
                    </div>
                  )}
                  
                  {stats.wordsFound !== undefined && stats.totalWords !== undefined && (
                    <div className="bg-emerald-500/20 rounded-lg p-4 border border-emerald-500/30">
                      <Star className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-emerald-400">
                        {stats.wordsFound}/{stats.totalWords}
                      </div>
                      <div className="text-sm text-gray-300">Words</div>
                    </div>
                  )}
                </div>

                {/* Additional Stats */}
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  {stats.difficulty && (
                    <Badge variant="outline" className="text-puzzle-gold border-puzzle-gold">
                      {stats.difficulty} Difficulty
                    </Badge>
                  )}
                  
                  {stats.gameType && (
                    <Badge variant="outline" className="text-puzzle-aqua border-puzzle-aqua">
                      {stats.gameType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  )}
                  
                  {stats.accuracy !== undefined && (
                    <Badge variant="outline" className={`border-current ${getPerformanceColor()}`}>
                      {stats.accuracy.toFixed(1)}% Accuracy
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={onPlayAgain}
                className="bg-puzzle-gold hover:bg-puzzle-gold/90 text-puzzle-black font-bold text-lg px-8 py-3"
                size="lg"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Play Again
              </Button>
              
              {onBackToMenu && (
                <Button 
                  onClick={onBackToMenu}
                  variant="outline"
                  className="border-puzzle-aqua text-puzzle-aqua hover:bg-puzzle-aqua hover:text-puzzle-black font-semibold text-lg px-8 py-3"
                  size="lg"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Main Menu
                </Button>
              )}
              
              {onClose && (
                <Button 
                  onClick={onClose}
                  variant="ghost"
                  className="text-gray-400 hover:text-puzzle-white"
                >
                  Close
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotateZ(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotateZ(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
