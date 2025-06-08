import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WordSearchEngine, WordSearchState } from '@/business/engines/word-search';
import { GameConfig } from '@/business/models/GameState';
import { usePayment } from '@/components/games/hooks/usePayment';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';
import { WordSearchGrid } from './WordSearchGrid';
import { WordSearchControls } from './WordSearchControls';
import { WordsList } from './WordsList';
import { useWordSearchSelection } from './hooks/useWordSearchSelection';
import { useGamePersistence } from '../hooks/useGamePersistence';
import { useLeaderboardSubmission } from '../hooks/useLeaderboardSubmission';
import { WordSelectionValidator } from './WordSelectionValidator';
import { Cell } from '@/business/engines/word-search/types';
import { stringsToCells, cellsToStrings } from '@/business/engines/word-search/utils';

export function WordSearchGame() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [engine, setEngine] = useState<WordSearchEngine | null>(null);
  const [gameState, setGameState] = useState<WordSearchState | null>(null);
  const [gameStatus, setGameStatus] = useState<'loading' | 'payment' | 'playing' | 'completed' | 'error'>('loading');
  const [validator, setValidator] = useState<WordSelectionValidator | null>(null);
  const [hintCells, setHintCells] = useState<Cell[]>([]); // New state for hint highlighting
  
  const entryFee = 1.99;
  const { paymentStatus, isProcessing, processPayment } = usePayment(entryFee);
  const { saveGameState, loadGameState } = useGamePersistence(`word-search-${Date.now()}`, 'word-search');
  const { submitScore } = useLeaderboardSubmission();
  
  const {
    currentSelection,
    startSelection,
    updateSelection,
    endSelection,
    clearSelection
  } = useWordSearchSelection();

  // Initialize game engine
  useEffect(() => {
    const initializeGame = async () => {
      try {
        console.log('Initializing Word Search Game...');
        
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

        const config: GameConfig = {
          gameType: 'word-search',
          hasTimer: true,
          hasScore: true,
          hasMoves: false,
          difficulty: 'rookie',
          hintsEnabled: true,
          soundEnabled: true,
          showGuide: true
        };

        const wordSearchEngine = new WordSearchEngine(initialState, config);
        
        wordSearchEngine.addEventListener((event) => {
          if (event.type === 'GAME_COMPLETED') {
            handleGameComplete();
          }
        });

        console.log('Calling engine.initialize()...');
        await wordSearchEngine.initialize();
        
        setEngine(wordSearchEngine);
        const newGameState = wordSearchEngine.getState();
        setGameState(newGameState);
        
        console.log('Game state after initialization:', {
          gridSize: newGameState.grid.length,
          wordsCount: newGameState.words.length,
          gridSample: newGameState.grid[0]?.slice(0, 5),
          words: newGameState.words
        });
        
        if (entryFee > 0 && !paymentStatus.hasAccess) {
          setGameStatus('payment');
        } else {
          setGameStatus('playing');
          wordSearchEngine.start();
        }
      } catch (error) {
        console.error('Failed to initialize game:', error);
        setGameStatus('error');
        toast({
          title: "Game Error",
          description: "Failed to initialize the game. Please try again.",
          variant: "destructive"
        });
      }
    };

    initializeGame();
  }, [entryFee, paymentStatus.hasAccess, toast]);

  // Update game state when engine changes
  useEffect(() => {
    if (engine) {
      const updateState = () => setGameState(engine.getState());
      const interval = setInterval(updateState, 1000);
      return () => clearInterval(interval);
    }
  }, [engine]);

  // Initialize validator when engine is ready
  useEffect(() => {
    if (engine && gameState) {
      console.log('Setting up validator...');
      const placedWords = engine.getPlacedWords();
      console.log('Validator receiving placed words:', placedWords.length);
      console.log('Validator placed words details:', placedWords.map(pw => pw.word));
      
      const newValidator = new WordSelectionValidator(placedWords, gameState.grid);
      setValidator(newValidator);
      console.log('Validator initialized successfully');
    }
  }, [engine, gameState]);

  // Auto-save game state
  useEffect(() => {
    if (gameState && gameStatus === 'playing') {
      saveGameState(gameState, user?.id);
    }
  }, [gameState, gameStatus, saveGameState, user?.id]);

  const handleGameComplete = useCallback(async () => {
    if (!engine || !gameState) return;
    
    setGameStatus('completed');
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    
    const completionTime = gameState.timeElapsed;
    const finalScore = engine.calculateScore();
    
    // Submit to leaderboard
    await submitScore({
      gameId: gameState.id,
      gameType: 'word-search',
      score: finalScore,
      completionTime,
      moves: gameState.moves,
      difficulty: gameState.difficulty
    });
    
    toast({ 
      title: "Congratulations!", 
      description: `You've found all words! Score: ${finalScore}` 
    });
  }, [engine, gameState, submitScore, toast]);

  const handlePayment = async () => {
    if (!user) {
      toast({ title: "Authentication Required", description: "Please log in to play games", variant: "destructive" });
      return;
    }
    const success = await processPayment(`word-search-${Date.now()}`);
    if (success && engine) {
      setGameStatus('playing');
      engine.start();
    }
  };

  const handleHint = useCallback(() => {
    if (!engine || !gameState || !validator) return;
    
    // Clear any existing hint
    setHintCells([]);
    
    // Get unfound words
    const unFoundWords = gameState.words.filter(word => !gameState.foundWords.has(word));
    
    if (unFoundWords.length === 0) {
      toast({
        title: "No More Words",
        description: "You've found all the words!",
      });
      return;
    }
    
    // Get placed words from engine
    const placedWords = engine.getPlacedWords();
    const randomWord = unFoundWords[Math.floor(Math.random() * unFoundWords.length)];
    const wordPlacement = placedWords.find(p => p.word === randomWord);
    
    if (wordPlacement && wordPlacement.cells.length > 0) {
      // Highlight the entire word for the hint
      setHintCells([...wordPlacement.cells]);
      
      // Update engine state
      engine.makeMove({ type: 'HINT' });
      
      toast({
        title: "Hint!",
        description: `Look for the word "${randomWord}" highlighted in orange`,
      });
      
      // Clear hint after 5 seconds
      setTimeout(() => {
        setHintCells([]);
      }, 5000);
    }
  }, [engine, gameState, validator, toast]);

  const handleSelectionEnd = useCallback(() => {
    const selection = endSelection();
    if (engine && gameState && selection.length > 0 && validator) {
      
      console.log('Handling selection end:', selection);
      
      // Clear any active hints when user makes a selection
      setHintCells([]);
      
      // Convert string cell IDs to Cell objects for validation
      const cellCoords: Cell[] = stringsToCells(selection);
      console.log('Cell coordinates for validation:', cellCoords);
      
      // Validate the selection
      const result = validator.validateSelection(cellCoords);
      console.log('Validation result:', result);
      
      if (result.isValid && result.word) {
        // Valid word found
        const newFoundWords = new Set([...gameState.foundWords, result.word]);
        const newScore = gameState.score + result.word.length * 10;
        
        engine.makeMove({ 
          type: 'SELECT_CELLS', 
          cells: cellCoords
        });
        
        setGameState(prev => prev ? {
          ...prev,
          foundWords: newFoundWords,
          selectedCells: [...prev.selectedCells, ...selection],
          score: newScore,
          moves: prev.moves + 1
        } : null);
        
        // Check for completion
        if (newFoundWords.size === gameState.words.length) {
          handleGameComplete();
        }
        
        toast({
          title: "Word Found!",
          description: `${result.word} (+${result.word.length * 10} points)`,
        });
      } else {
        // Invalid selection
        toast({
          title: "Try Again",
          description: "That's not a valid word.",
          variant: "destructive"
        });
      }
      
      clearSelection();
    }
  }, [engine, gameState, validator, endSelection, clearSelection, handleGameComplete, toast]);

  if (gameStatus === 'loading' || !engine || !gameState) {
    return <div className="flex justify-center items-center min-h-[400px]">Loading...</div>;
  }

  if (gameStatus === 'payment') {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader><CardTitle>Word Search Game</CardTitle></CardHeader>
        <CardContent className="text-center space-y-4">
          <p>Entry fee: ${entryFee.toFixed(2)}</p>
          <button onClick={handlePayment} disabled={isProcessing} className="btn-primary">
            {isProcessing ? 'Processing...' : `Play Now - $${entryFee.toFixed(2)}`}
          </button>
        </CardContent>
      </Card>
    );
  }

  if (gameStatus === 'error') {
    return <Alert variant="destructive"><AlertDescription>Failed to load game</AlertDescription></Alert>;
  }

  // Convert selectedCells string[] to Cell[] for the grid component
  const selectedCellsAsObjects: Cell[] = stringsToCells(gameState.selectedCells);

  // Convert currentSelection string[] to Cell[] for the grid component
  const currentSelectionAsObjects: Cell[] = stringsToCells(currentSelection);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Word Search Game</CardTitle>
            <div className="flex gap-4 text-sm">
              <span>Score: {gameState.score}</span>
              <span>Found: {gameState.foundWords.size}/{gameState.words.length}</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {gameStatus === 'completed' && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            🎉 Congratulations! You found all words!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <WordSearchGrid
            grid={gameState.grid}
            selectedCells={selectedCellsAsObjects}
            currentSelection={currentSelectionAsObjects}
            hintCells={hintCells}
            onSelectionStart={(cell) => startSelection(cell)}
            onSelectionMove={(cell) => updateSelection(cell)}
            onSelectionEnd={handleSelectionEnd}
            isDisabled={gameStatus === 'completed'}
          />
        </div>
        
        <div className="space-y-4">
          <WordSearchControls
            timeElapsed={gameState.timeElapsed}
            isPaused={gameState.status === 'paused'}
            onPause={() => engine.pause()}
            onResume={() => engine.resume()}
            onReset={() => { engine.reset(); setGameStatus('playing'); }}
            onHint={handleHint}
            hintsUsed={gameState.hintsUsed}
            isGameComplete={gameStatus === 'completed'}
          />
          
          <WordsList
            words={gameState.words}
            foundWords={gameState.foundWords}
          />
        </div>
      </div>
    </div>
  );
}

export default WordSearchGame;
