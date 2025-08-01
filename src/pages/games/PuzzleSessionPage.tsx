import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useClerkAuth } from '@/hooks/useClerkAuth';
import PuzzleGameEngine from '@/components/games/puzzle/PuzzleGameEngine';

const PuzzleSessionPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useClerkAuth();
  
  // Mock session data - in real implementation, fetch from API
  const [sessionData, setSessionData] = useState({
    id: sessionId,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    difficulty: 'medium',
    title: 'Beautiful Landscape',
    userId: user?.id
  });

  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // In real implementation, fetch session data from API
    if (!sessionId) {
      toast({
        title: 'Error',
        description: 'Invalid puzzle session',
        variant: 'destructive'
      });
      navigate('/games');
    }
  }, [sessionId, navigate, toast]);

  const handlePuzzleComplete = (results) => {
    setIsCompleted(true);
    
    // In real implementation, save results to database
    console.log('Puzzle completed:', results);
    
    toast({
      title: '🎉 Congratulations!',
      description: `Puzzle completed with a score of ${results.score}!`
    });
  };

  const handleBackToGames = () => {
    navigate('/games');
  };

  const handlePlayAgain = () => {
    setIsCompleted(false);
    // In real implementation, create new session
    window.location.reload();
  };

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-puzzle-black flex items-center justify-center">
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Loading Puzzle...</h2>
              <p className="text-muted-foreground">Please wait while we prepare your puzzle.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-puzzle-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleBackToGames}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Games
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-puzzle-white">{sessionData.title}</h1>
              <p className="text-muted-foreground">Session: {sessionId}</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/')}
          >
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
        </div>

        {/* Completion Overlay */}
        {isCompleted && (
          <Card className="mb-6 border-puzzle-aqua">
            <CardHeader>
              <CardTitle className="text-center text-puzzle-aqua">
                🎉 Puzzle Completed!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Congratulations on completing this puzzle!
                </p>
                <div className="flex justify-center space-x-4">
                  <Button onClick={handlePlayAgain}>
                    Play Again
                  </Button>
                  <Button variant="outline" onClick={handleBackToGames}>
                    Browse More Puzzles
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Game */}
        <PuzzleGameEngine
          imageUrl={sessionData.imageUrl}
          difficulty={sessionData.difficulty}
          sessionId={sessionId}
          onComplete={handlePuzzleComplete}
        />

        {/* Game Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How to Play</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-semibold mb-2">Controls:</h4>
                <ul className="space-y-1">
                  <li>• Click and drag pieces to move them</li>
                  <li>• Pieces will snap when close to correct position</li>
                  <li>• Use hints to highlight correct positions</li>
                  <li>• Pause anytime to take a break</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Scoring:</h4>
                <ul className="space-y-1">
                  <li>• Faster completion = higher score</li>
                  <li>• Fewer moves = efficiency bonus</li>
                  <li>• Perfect game = no wrong placements</li>
                  <li>• Hints reduce final score</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PuzzleSessionPage;