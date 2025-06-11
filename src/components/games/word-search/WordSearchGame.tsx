
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WordSearchGrid } from './WordSearchGrid';
import { WordsList } from './WordsList';
import { WordSearchControls } from './WordSearchControls';
import { WordSearchCongratulations } from './WordSearchCongratulations';
import { WordSearchInstructions } from './WordSearchInstructions';
import { ResponsiveGameContainer } from '../ResponsiveGameContainer';
import { useGamePersistence } from '../hooks/useGamePersistence';
import { useToast } from '@/hooks/use-toast';
import { WordSearchEngine } from '@/business/engines/word-search/WordSearchEngine';
import type { WordSearchState } from '@/business/engines/word-search/WordSearchEngine';
import { stringsToCells, cellsToStrings } from '@/business/engines/word-search/utils';

interface Cell {
  row: number;
  col: number;
}

export function WordSearchGame() {
  const { toast } = useToast();
  const { saveGameState, loadGameState } = useGamePersistence('word-search', 'word-search');
  
  const [engine, setEngine] = useState<WordSearchEngine | null>(null);
  const [gameState, setGameState] = useState<WordSearchState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize the game engine
  useEffect(() => {
    const initializeEngine = async () => {
      try {
        setIsLoading(true);
        
        const initialState: WordSearchState = {
          id: 'word-search-game',
          status: 'idle',
          score: 0,
          moves: 0,
          startTime: null,
          endTime: null,
          isComplete: false,
          error: null,
          grid: [],
          words: [],
          foundWords: new Set<string>(),
          selectedCells: [],
          currentSelection: [],
          hintCells: [],
          difficulty: 'rookie',
          timeElapsed: 0,
          hintsUsed: 0
        };

        const gameConfig = {
          gameType: 'word-search' as const,
          hasTimer: true,
          hasScore: true,
          hasMoves: true,
          difficulty: 'easy' as const,
          enableHints: true
        };

        const newEngine = new WordSearchEngine(initialState, gameConfig);
        
        // Try to load saved state first
        const savedState = await loadGameState();
        if (savedState) {
          console.log('Loading saved game state:', savedState);
          newEngine.restoreGameState(savedState);
        } else {
          await newEngine.initialize();
        }
        
        setEngine(newEngine);
        setGameState(newEngine.getState());
        
        // Subscribe to engine state changes
        const unsubscribe = newEngine.subscribe((newState) => {
          setGameState(newState);
          // Auto-save when state changes
          saveGameState(newEngine.getGameStateForSave());
        });
        
        // Cleanup subscription on unmount
        return () => {
          if (unsubscribe) {
            unsubscribe();
          }
        };
        
      } catch (error) {
        console.error('Failed to initialize Word Search engine:', error);
        toast({
          title: "Game Error",
          description: "Failed to initialize the word search game.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeEngine();
  }, []);

  const handleSelectionStart = useCallback((cell: Cell) => {
    if (!engine || gameState?.status !== 'playing') return;
    
    engine.makeMove({
      type: 'SELECT_CELLS',
      cells: [cellsToStrings([cell])[0]]
    });
  }, [engine, gameState?.status]);

  const handleSelectionMove = useCallback((cell: Cell) => {
    if (!engine || gameState?.status !== 'playing') return;
    
    // Get current selection from engine state and add new cell
    const currentSelection = stringsToCells(gameState?.currentSelection || []);
    const cellExists = currentSelection.find(c => c.row === cell.row && c.col === cell.col);
    
    if (!cellExists) {
      const newSelection = [...currentSelection, cell];
      engine.makeMove({
        type: 'SELECT_CELLS',
        cells: cellsToStrings(newSelection)
      });
    }
  }, [engine, gameState?.status, gameState?.currentSelection]);

  const handleSelectionEnd = useCallback(() => {
    if (!engine || !gameState || !gameState.currentSelection.length) {
      return;
    }

    // Use engine to validate the selection
    const validation = engine.validateWordSelection(gameState.currentSelection);
    
    if (validation.isValid && validation.word) {
      // Word found! Use engine to handle the move
      engine.makeMove({
        type: 'WORD_FOUND',
        word: validation.word,
        cells: gameState.currentSelection
      });
      
      toast({
        title: "Word Found!",
        description: `You found "${validation.word.toUpperCase()}"`,
        duration: 2000,
      });
    } else {
      // Clear selection if word not found
      engine.makeMove({
        type: 'SELECT_CELLS',
        cells: []
      });
    }
  }, [engine, gameState, toast]);

  const handleStart = useCallback(() => {
    if (engine) {
      engine.start();
    }
  }, [engine]);

  const handlePause = useCallback(() => {
    if (engine) {
      engine.pause();
    }
  }, [engine]);

  const handleResume = useCallback(() => {
    if (engine) {
      engine.resume();
    }
  }, [engine]);

  const handleReset = useCallback(() => {
    if (engine) {
      engine.reset();
    }
  }, [engine]);

  const handleHint = useCallback(() => {
    if (engine && gameState) {
      console.log('Hint requested from component');
      engine.makeMove({ type: 'HINT' });
      
      // Clear hint after 3 seconds using the engine's method
      setTimeout(() => {
        if (engine) {
          engine.clearHints();
        }
      }, 3000);
    }
  }, [engine, gameState]);

  const handleSave = useCallback(async () => {
    if (engine) {
      await saveGameState(engine.getGameStateForSave());
      toast({
        title: "Game Saved",
        description: "Your progress has been saved.",
      });
    }
  }, [engine, saveGameState, toast]);

  if (isLoading) {
    return (
      <ResponsiveGameContainer>
        <Card className="w-full">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p>Loading Word Search...</p>
            </div>
          </CardContent>
        </Card>
      </ResponsiveGameContainer>
    );
  }

  if (!gameState || !engine) {
    return (
      <ResponsiveGameContainer>
        <Card className="w-full">
          <CardContent className="p-8">
            <p className="text-center text-red-600">Failed to load the game. Please refresh the page.</p>
          </CardContent>
        </Card>
      </ResponsiveGameContainer>
    );
  }

  // Convert engine state to component props
  const selectedCells = stringsToCells(gameState.selectedCells);
  const currentSelectionForGrid = stringsToCells(gameState.currentSelection);
  const hintCells = stringsToCells(gameState.hintCells || []);

  return (
    <ResponsiveGameContainer>
      <div className="w-full max-w-6xl mx-auto space-y-6">
        {/* Game Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Word Search Arena
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Game Status and Instructions */}
        {gameState.status === 'idle' && (
          <WordSearchInstructions 
            difficulty={gameState.difficulty === 'expert' ? 'pro' : gameState.difficulty as 'rookie' | 'master' | 'pro'}
            category="General"
            totalWords={gameState.words.length}
          />
        )}

        {/* Game Completed */}
        {gameState.isComplete && (
          <WordSearchCongratulations 
            isOpen={true}
            onClose={handleReset}
            score={gameState.score}
            timeElapsed={gameState.timeElapsed}
            wordsFound={gameState.foundWords.size}
            totalWords={gameState.words.length}
            incorrectSelections={0}
            onPlayAgain={handleReset}
            onViewLeaderboard={() => {}}
          />
        )}

        {/* Main Game Area */}
        {gameState.status !== 'idle' && !gameState.isComplete && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Game Grid */}
            <div className="lg:col-span-2">
              <WordSearchGrid
                grid={gameState.grid}
                selectedCells={selectedCells}
                currentSelection={currentSelectionForGrid}
                hintCells={hintCells}
                onSelectionStart={handleSelectionStart}
                onSelectionMove={handleSelectionMove}
                onSelectionEnd={handleSelectionEnd}
                isDisabled={gameState.status === 'paused'}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Game Controls */}
              <WordSearchControls
                timeElapsed={gameState.timeElapsed}
                isPaused={gameState.status === 'paused'}
                onPause={handlePause}
                onResume={handleResume}
                onReset={handleReset}
                onHint={handleHint}
                hintsUsed={gameState.hintsUsed}
                isGameComplete={gameState.isComplete}
              />

              {/* Words List */}
              <WordsList
                words={gameState.words}
                foundWords={gameState.foundWords}
              />

              {/* Save Game Button */}
              <Card>
                <CardContent className="p-4">
                  <button
                    onClick={handleSave}
                    className="w-full bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Save Game
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Start Game Button for idle state */}
        {gameState.status === 'idle' && (
          <div className="text-center">
            <button
              onClick={handleStart}
              className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-white px-8 py-3 rounded-lg text-lg font-semibold"
            >
              Start Game
            </button>
          </div>
        )}
      </div>
    </ResponsiveGameContainer>
  );
}
