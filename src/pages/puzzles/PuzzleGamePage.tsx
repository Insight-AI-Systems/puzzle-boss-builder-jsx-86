import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
// Removed PuzzleGameLayout and PuzzleGameCanvas - using direct EnhancedJigsawPuzzle
import { PuzzleCompletionModal } from '@/components/puzzles/completion/PuzzleCompletionModal';
import EnhancedJigsawPuzzle from '@/components/puzzles/engines/EnhancedJigsawPuzzle';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Play, Pause } from 'lucide-react';

interface GameState {
  timeElapsed: number;
  moves: number;
  completionPercentage: number;
  hintsUsed: number;
  isPaused: boolean;
  isComplete: boolean;
  showGuide: boolean;
}

// Mock puzzle data - in real app would come from API
const mockPuzzleData = {
  'puzzle-1': {
    name: 'Mountain Landscape',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    difficulty: 'Easy',
    pieces: 20,
    rows: 4,
    columns: 5
  },
  'puzzle-2': {
    name: 'City Skyline',
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
    difficulty: 'Medium',
    pieces: 100,
    rows: 10,
    columns: 10
  },
  'puzzle-3': {
    name: 'Ocean Waves',
    imageUrl: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop',
    difficulty: 'Hard',
    pieces: 500,
    rows: 20,
    columns: 25
  }
};

export const PuzzleGamePage: React.FC = () => {
  const { puzzleId } = useParams<{ puzzleId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [gameState, setGameState] = useState<GameState>({
    timeElapsed: 0,
    moves: 0,
    completionPercentage: 0,
    hintsUsed: 0,
    isPaused: false,
    isComplete: false,
    showGuide: false
  });

  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Get puzzle data
  const puzzleData = puzzleId ? mockPuzzleData[puzzleId as keyof typeof mockPuzzleData] : null;
  const difficulty = searchParams.get('difficulty');

  // Handle custom puzzle based on difficulty
  const getCustomPuzzleData = () => {
    const difficultyMap = {
      'easy': { rows: 4, columns: 5, pieces: 20 },
      'medium': { rows: 10, columns: 10, pieces: 100 },
      'hard': { rows: 20, columns: 25, pieces: 500 }
    };

    const config = difficultyMap[difficulty as keyof typeof difficultyMap] || difficultyMap.easy;
    
    return {
      name: `Custom ${difficulty} Puzzle`,
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      difficulty: difficulty || 'easy',
      ...config
    };
  };

  const currentPuzzle = puzzleData || getCustomPuzzleData();

  // Timer effect
  useEffect(() => {
    if (!gameState.isPaused && !gameState.isComplete) {
      const timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeElapsed: prev.timeElapsed + 1
        }));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState.isPaused, gameState.isComplete]);

  const handleAction = (action: string) => {
    switch (action) {
      case 'pause':
        setGameState(prev => ({ ...prev, isPaused: true }));
        toast({
          title: "Game Paused",
          description: "Click resume to continue"
        });
        break;
      case 'resume':
        setGameState(prev => ({ ...prev, isPaused: false }));
        break;
      case 'hint':
        setGameState(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
        toast({
          title: "Hint Used",
          description: "Look for edge pieces first!"
        });
        break;
      case 'toggle-guide':
        setGameState(prev => ({ ...prev, showGuide: !prev.showGuide }));
        break;
      case 'reset':
        setGameState({
          timeElapsed: 0,
          moves: 0,
          completionPercentage: 0,
          hintsUsed: 0,
          isPaused: false,
          isComplete: false,
          showGuide: false
        });
        toast({
          title: "Game Reset",
          description: "Starting fresh puzzle"
        });
        break;
    }
  };

  const handleGameComplete = () => {
    setGameState(prev => ({ ...prev, isComplete: true, completionPercentage: 100 }));
    setShowCompletionModal(true);
  };

  const handlePlayAgain = () => {
    setShowCompletionModal(false);
    handleAction('reset');
  };

  const handleReturnHome = () => {
    navigate('/puzzles');
  };

  const handleViewLeaderboard = () => {
    navigate('/leaderboard');
  };

  if (!currentPuzzle) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-puzzle-white mb-4">Puzzle Not Found</h1>
          <Button 
            onClick={() => navigate('/puzzles')}
            className="bg-puzzle-aqua text-puzzle-black hover:bg-puzzle-aqua/90"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Puzzles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-puzzle-aqua/20 bg-puzzle-black/50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/puzzles')}
                  className="text-puzzle-aqua border-puzzle-aqua/50 hover:bg-puzzle-aqua/10"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-puzzle-white">{currentPuzzle.name}</h1>
                  <p className="text-sm text-muted-foreground">
                    {currentPuzzle.difficulty} • {currentPuzzle.pieces} pieces
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleAction(gameState.isPaused ? 'resume' : 'pause')}
                  className="text-puzzle-aqua border-puzzle-aqua/50 hover:bg-puzzle-aqua/10"
                >
                  {gameState.isPaused ? (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <EnhancedJigsawPuzzle
              imageUrl={currentPuzzle.imageUrl}
              rows={currentPuzzle.rows}
              columns={currentPuzzle.columns}
              puzzleId={puzzleId || 'custom'}
              showNumbers={false}
              showGuide={gameState.showGuide}
              onComplete={handleGameComplete}
            />
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      <PuzzleCompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        puzzleName={currentPuzzle.name}
        stats={{
          timeElapsed: gameState.timeElapsed,
          moves: gameState.moves,
          difficulty: currentPuzzle.difficulty,
          hintsUsed: gameState.hintsUsed,
          score: Math.max(1000 - (gameState.moves * 10) - (gameState.hintsUsed * 50), 100),
          rank: Math.floor(Math.random() * 10) + 1,
          isPersonalBest: Math.random() > 0.5,
          achievements: gameState.hintsUsed === 0 ? ['No Hints Master'] : []
        }}
        onPlayAgain={handlePlayAgain}
        onViewLeaderboard={handleViewLeaderboard}
        onReturnHome={handleReturnHome}
        onShare={() => {
          navigator.share?.({
            title: `I completed ${currentPuzzle.name}!`,
            text: `Just solved a ${currentPuzzle.difficulty} puzzle in ${Math.floor(gameState.timeElapsed / 60)}:${(gameState.timeElapsed % 60).toString().padStart(2, '0')}`,
            url: window.location.href
          });
        }}
      />
    </>
  );
};

export default PuzzleGamePage;