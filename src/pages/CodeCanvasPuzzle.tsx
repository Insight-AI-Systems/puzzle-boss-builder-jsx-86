import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

declare global {
  interface Window {
    CGame: any;
    PuzzleSettings: any;
  }
}

const CodeCanvasPuzzle: React.FC = () => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [game, setGame] = useState<any>(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [selectedImage, setSelectedImage] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  // Load CodeCanyon scripts
  useEffect(() => {
    const loadScript = (src: string) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const loadScripts = async () => {
      try {
        await loadScript('/js/settings.js');
        await loadScript('/js/CPiece.js');
        await loadScript('/js/CGame.js');
        setScriptsLoaded(true);
      } catch (error) {
        console.error('Failed to load CodeCanyon scripts:', error);
      }
    };

    loadScripts();
  }, []);

  // Initialize default image
  useEffect(() => {
    if (scriptsLoaded && window.PuzzleSettings && !selectedImage) {
      setSelectedImage(window.PuzzleSettings.getRandomImage());
    }
  }, [scriptsLoaded, selectedImage]);

  const initializePuzzle = () => {
    if (!canvasContainerRef.current || !window.CGame || !selectedImage) return;

    // Clear container
    canvasContainerRef.current.innerHTML = '';
    
    // Create unique container ID
    const containerId = 'puzzle-canvas-' + Date.now();
    const container = document.createElement('div');
    container.id = containerId;
    canvasContainerRef.current.appendChild(container);

    // Get difficulty settings
    const difficultySettings = window.PuzzleSettings.getDifficulty(difficulty);

    // Initialize game
    const newGame = new window.CGame({
      containerId,
      imageUrl: selectedImage,
      rows: difficultySettings.rows,
      columns: difficultySettings.columns,
      onComplete: () => {
        setIsComplete(true);
        console.log('Puzzle completed!');
      }
    });

    setGame(newGame);
    setIsComplete(false);
  };

  const handleNewGame = () => {
    initializePuzzle();
  };

  const handleImageChange = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleDifficultyChange = (newDifficulty: string) => {
    setDifficulty(newDifficulty);
  };

  // Initialize puzzle when scripts are loaded and image is selected
  useEffect(() => {
    if (scriptsLoaded && selectedImage) {
      initializePuzzle();
    }
  }, [scriptsLoaded, selectedImage, difficulty]);

  if (!scriptsLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              <span className="ml-3">Loading CodeCanyon Jigsaw Deluxe...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">CodeCanyon Jigsaw Deluxe</h1>
          <p className="text-muted-foreground">
            Advanced jigsaw puzzle engine with smooth drag-and-drop interaction
          </p>
        </div>

        {/* Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Puzzle Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <label htmlFor="difficulty" className="text-sm font-medium">
                  Difficulty:
                </label>
                <Select value={difficulty} onValueChange={handleDifficultyChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy (3×3)</SelectItem>
                    <SelectItem value="medium">Medium (4×4)</SelectItem>
                    <SelectItem value="hard">Hard (5×5)</SelectItem>
                    <SelectItem value="expert">Expert (6×6)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="image" className="text-sm font-medium">
                  Image:
                </label>
                <Select value={selectedImage} onValueChange={handleImageChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select an image" />
                  </SelectTrigger>
                  <SelectContent>
                    {window.PuzzleSettings?.defaultImages.map((imageUrl: string, index: number) => (
                      <SelectItem key={index} value={imageUrl}>
                        Nature Scene {index + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleNewGame} variant="outline">
                New Game
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Completion Message */}
        {isComplete && (
          <Card className="mb-8 border-green-500">
            <CardContent className="pt-6">
              <div className="text-center text-green-600">
                <h2 className="text-2xl font-bold mb-2">🎉 Puzzle Completed!</h2>
                <p>Congratulations! You've successfully solved the puzzle.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Puzzle Canvas */}
        <Card>
          <CardHeader>
            <CardTitle>Puzzle Game</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div
                ref={canvasContainerRef}
                className="border rounded-lg bg-gray-100 dark:bg-gray-900"
                style={{ minHeight: '600px', minWidth: '600px' }}
              />
            </div>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              <p>Drag pieces to move them. Pieces will snap to the grid automatically.</p>
              <p>Numbers in the corner show the piece order for reference.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CodeCanvasPuzzle;