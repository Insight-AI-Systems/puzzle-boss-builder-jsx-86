
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WordSearchEngine, WordSearchState } from '@/business/engines/word-search';
import { GameConfig } from '@/business/models/GameState';
import { usePayment } from '@/components/games/hooks/usePayment';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Timer, Play, Pause, RotateCcw, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

interface Cell {
  row: number;
  col: number;
}

const GRID_SIZE = 10;
const CELL_SIZE = 40;
const HIGHLIGHT_COLOR = 'rgba(255, 255, 0, 0.5)';

export function WordSearchGame() {
  const { user } = useAuth();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Game state
  const [engine, setEngine] = useState<WordSearchEngine | null>(null);
  const [gameState, setGameState] = useState<WordSearchState | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [dragStart, setDragStart] = useState<{ row: number; col: number } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ row: number; col: number } | null>(null);
  const [gameStatus, setGameStatus] = useState<'loading' | 'payment' | 'playing' | 'completed' | 'error'>('loading');

  // Payment handling with optional entry fee
  const entryFee = 1.99;
  const { paymentStatus, isProcessing, processPayment } = usePayment(entryFee);

  // Initialize game engine
  useEffect(() => {
    const initializeGame = async () => {
      try {
        // Create initial game state
        const initialState: WordSearchState = {
          id: `word-search-${Date.now()}`,
          status: 'idle',
          startTime: null,
          endTime: null,
          score: 0,
          moves: 0,
          isComplete: false,
          grid: [],
          words: [],
          foundWords: new Set<string>(),
          selectedCells: [],
          currentSelection: [],
          difficulty: 'rookie',
          timeElapsed: 0,
          hintsUsed: 0
        };

        // Create game configuration
        const config: GameConfig = {
          gameType: 'word-search',
          hasTimer: true,
          hasScore: true,
          hasMoves: false,
          entryFee: entryFee,
          difficulty: 'rookie',
          hintsEnabled: true,
          soundEnabled: true,
          showGuide: true
        };

        // Create and initialize engine
        const wordSearchEngine = new WordSearchEngine(initialState, config);
        
        // Listen to engine events
        wordSearchEngine.addEventListener((event) => {
          console.log('Word search engine event:', event);
          
          if (event.type === 'GAME_COMPLETED') {
            handleGameComplete();
          }
        });

        await wordSearchEngine.initialize();
        setEngine(wordSearchEngine);
        setGameState(wordSearchEngine.getState());
        
        // Set status based on payment requirements
        if (entryFee > 0 && !paymentStatus.hasAccess) {
          setGameStatus('payment');
        } else {
          setGameStatus('playing');
        }
      } catch (error) {
        console.error('Failed to initialize game:', error);
        setGameStatus('error');
        toast({
          title: "Game Error",
          description: "Failed to initialize the word search game",
          variant: "destructive"
        });
      }
    };

    initializeGame();
  }, [entryFee, paymentStatus.hasAccess, toast]);

  // Handle payment processing
  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to play games",
        variant: "destructive"
      });
      return;
    }

    const success = await processPayment(`word-search-${Date.now()}`);
    if (success) {
      setGameStatus('playing');
      if (engine) {
        engine.start();
      }
    }
  };

  // Handle game completion
  const handleGameComplete = useCallback(() => {
    setGameStatus('completed');
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    toast({
      title: "Congratulations!",
      description: "You've found all the words!",
    });
  }, [toast]);

  // Canvas drawing function
  const drawGrid = useCallback(() => {
    if (!canvasRef.current || !gameState) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid cells
    gameState.grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const x = colIndex * CELL_SIZE;
        const y = rowIndex * CELL_SIZE;

        // Draw cell background
        ctx.fillStyle = 'white';
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);

        // Highlight selected cells
        if (gameState.selectedCells.some(selectedCell => selectedCell.row === rowIndex && selectedCell.col === colIndex)) {
          ctx.fillStyle = HIGHLIGHT_COLOR;
          ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        }

        // Draw cell border
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);

        // Draw cell letter
        ctx.font = '20px sans-serif';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(cell, x + CELL_SIZE / 2, y + CELL_SIZE / 2);
      });
    });
  }, [gameState]);

  // Initialize canvas and draw grid on game state changes
  useEffect(() => {
    if (!canvasRef.current || !gameState) return;

    const canvas = canvasRef.current;
    canvas.width = GRID_SIZE * CELL_SIZE;
    canvas.height = GRID_SIZE * CELL_SIZE;

    drawGrid();
  }, [gameState, drawGrid]);

  // Event handlers
  const getCellCoordinates = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return null;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);

    return { row, col };
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!engine || gameStatus !== 'playing') return;

    const cell = getCellCoordinates(event);
    if (!cell) return;

    setIsSelecting(true);
    setDragStart(cell);
    setDragEnd(cell);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isSelecting || !engine || gameStatus !== 'playing') return;

    const cell = getCellCoordinates(event);
    if (!cell) return;

    setDragEnd(cell);

    // Get cells between dragStart and dragEnd
    const cellsBetween: Cell[] = [];
    if (dragStart) {
      const rowDiff = Math.abs(cell.row - dragStart.row);
      const colDiff = Math.abs(cell.col - dragStart.col);

      if (rowDiff <= 1 && colDiff <= 1) {
        // Determine direction
        const rowDir = cell.row > dragStart.row ? 1 : cell.row < dragStart.row ? -1 : 0;
        const colDir = cell.col > dragStart.col ? 1 : cell.col < dragStart.col ? -1 : 0;

        // Add cells in between
        let currentRow = dragStart.row;
        let currentCol = dragStart.col;
        while (currentRow !== cell.row + rowDir || currentCol !== cell.col + colDir) {
          cellsBetween.push({ row: currentRow, col: currentCol });
          currentRow += rowDir;
          currentCol += colDir;
        }
      }
    }

    // Update current selection
    engine.makeMove({
      type: 'SELECT_CELLS',
      cells: cellsBetween
    });
  };

  const handleMouseUp = () => {
    if (!engine || gameStatus !== 'playing') return;

    setIsSelecting(false);
    setDragStart(null);
    setDragEnd(null);

    engine.makeMove({ type: 'VALIDATE_SELECTION' });
  };

  const handleMouseLeave = () => {
    if (isSelecting) {
      setIsSelecting(false);
      setDragStart(null);
      setDragEnd(null);
    }
  };

  // Payment gate UI
  if (gameStatus === 'payment') {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Word Search Game</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Ready to Play?</h3>
              <p className="text-gray-600 mb-4">
                Entry fee: ${entryFee.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {paymentStatus.willUseCredits 
                  ? `Will use ${entryFee} credits from your balance of ${paymentStatus.credits}`
                  : `Will charge $${entryFee.toFixed(2)} from your wallet`
                }
              </p>
              <Button
                onClick={handlePayment}
                disabled={isProcessing || !paymentStatus.hasAccess}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isProcessing ? 'Processing...' : `Play Now - $${entryFee.toFixed(2)}`}
              </Button>
              {!paymentStatus.hasAccess && (
                <p className="text-red-600 text-sm mt-2">
                  Insufficient funds. Please add money to your wallet or earn more credits.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (gameStatus === 'loading' || !engine || !gameState) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading Word Search...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (gameStatus === 'error') {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load the word search game. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Main game UI rendering
  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Game Header */}
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Word Search Game
              {gameState.status === 'playing' && (
                <span className="text-sm text-green-600">Playing</span>
              )}
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4" />
                <span>{Math.floor(gameState.timeElapsed / 60)}:{(gameState.timeElapsed % 60).toString().padStart(2, '0')}</span>
              </div>
              <div className="text-sm">
                Score: {gameState.score}
              </div>
              <div className="text-sm">
                Found: {gameState.foundWords.size}/{gameState.words.length}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Game Completed */}
      {gameStatus === 'completed' && (
        <Alert className="mb-4 border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            🎉 Congratulations! You found all {gameState.words.length} words in {Math.floor(gameState.timeElapsed / 60)} minutes and {gameState.timeElapsed % 60} seconds!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Game Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-4">
              <canvas
                ref={canvasRef}
                className="border border-gray-200 cursor-crosshair max-w-full"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                onClick={() => {
                  if (gameState.status === 'playing') {
                    engine.pause();
                  } else if (gameState.status === 'paused') {
                    engine.resume();
                  }
                }}
                variant="outline"
                className="w-full"
                disabled={gameStatus === 'completed'}
              >
                {gameState.status === 'playing' ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Resume
                  </>
                )}
              </Button>
              
              <Button
                onClick={() => {
                  engine.reset();
                  setGameStatus('playing');
                }}
                variant="outline"
                className="w-full"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                New Game
              </Button>

              <Button
                onClick={() => {
                  engine.makeMove({ type: 'HINT' });
                }}
                variant="outline"
                className="w-full"
                disabled={gameStatus === 'completed'}
              >
                <Eye className="w-4 h-4 mr-2" />
                Hint ({gameState.hintsUsed} used)
              </Button>
            </CardContent>
          </Card>

          {/* Words List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Words to Find</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {gameState.words.map((word, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded text-sm ${
                      gameState.foundWords.has(word)
                        ? 'bg-green-100 text-green-800 line-through'
                        : 'bg-gray-50'
                    }`}
                  >
                    {word.toUpperCase()}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default WordSearchGame;
