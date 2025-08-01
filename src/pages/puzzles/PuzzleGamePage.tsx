import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
// Removed PuzzleGameLayout and PuzzleGameCanvas - using direct EnhancedJigsawPuzzle
import { PuzzleCompletionModal } from '@/components/puzzles/completion/PuzzleCompletionModal';
import ModernPuzzleEngine from '@/components/puzzles/engines/ModernPuzzleEngine';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Play, Pause } from 'lucide-react';

// DEBUG: Add diagnostic logging
console.log('🔍 PuzzleGamePage loading - using NEW ModernPuzzleEngine');
console.log('📦 Components imported:', { ModernPuzzleEngine });

// Removed GameState interface - using EnhancedJigsawPuzzle's built-in state management

// Enhanced puzzle data - using generic naming for new JavaScript engine
const enhancedPuzzleData = {
  'puzzle-1': {
    name: 'Nature Scene',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    difficulty: 'Easy',
    pieces: 20,
    rows: 4,
    columns: 5
  },
  'puzzle-2': {
    name: 'Urban View',
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
    difficulty: 'Medium',
    pieces: 100,
    rows: 10,
    columns: 10
  },
  'puzzle-3': {
    name: 'Water Scene',
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

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // Get puzzle data
  const puzzleData = puzzleId ? enhancedPuzzleData[puzzleId as keyof typeof enhancedPuzzleData] : null;
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

  // Timer logic removed - using EnhancedJigsawPuzzle's built-in timer

  const handleToggleGuide = () => {
    setShowGuide(prev => !prev);
  };

  const handleGameComplete = (stats: { moves: number; time: number; }) => {
    setShowCompletionModal(true);
  };

  const handlePlayAgain = () => {
    setShowCompletionModal(false);
    // Reset will be handled by EnhancedJigsawPuzzle's key change
    window.location.reload();
  };

  const handleReturnHome = () => {
    navigate('/puzzles');
  };

  const handleViewLeaderboard = () => {
    navigate('/leaderboard');
  };

  // DEBUG: Log component rendering
  console.log('🎯 Rendering PuzzleGamePage with puzzle:', currentPuzzle);
  console.log('🔍 Current puzzle ID from URL:', puzzleId);

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
      {/* MODERN ENGINE: Clean rectangular pieces instead of jigsaw tabs */}
      <div data-puzzle-engine="modern-clean-design" className="min-h-screen bg-background">
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
                  onClick={handleToggleGuide}
                  className="text-puzzle-aqua border-puzzle-aqua/50 hover:bg-puzzle-aqua/10"
                >
                  {showGuide ? 'Hide Guide' : 'Show Guide'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Game Area - ONLY EnhancedJigsawPuzzle */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* CACHE BUSTER: Force complete refresh */}
            <div key={`puzzle-${puzzleId}-${Date.now()}`} data-component="modern-puzzle-engine-only">
              <ModernPuzzleEngine
                imageUrl={currentPuzzle.imageUrl}
                rows={currentPuzzle.rows}
                columns={currentPuzzle.columns}
                puzzleId={puzzleId || 'custom'}
                showNumbers={false}
                showGuide={showGuide}
                onComplete={handleGameComplete}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      <PuzzleCompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        puzzleName={currentPuzzle.name}
        stats={{
          timeElapsed: 120, // Mock data - EnhancedJigsawPuzzle will provide actual stats
          moves: 50,
          difficulty: currentPuzzle.difficulty,
          hintsUsed: 0,
          score: 950,
          rank: Math.floor(Math.random() * 10) + 1,
          isPersonalBest: Math.random() > 0.5,
          achievements: []
        }}
        onPlayAgain={handlePlayAgain}
        onViewLeaderboard={handleViewLeaderboard}
        onReturnHome={handleReturnHome}
        onShare={() => {
          navigator.share?.({
            title: `I completed ${currentPuzzle.name}!`,
            text: `Just solved a ${currentPuzzle.difficulty} puzzle!`,
            url: window.location.href
          });
        }}
      />
    </>
  );
};

export default PuzzleGamePage;