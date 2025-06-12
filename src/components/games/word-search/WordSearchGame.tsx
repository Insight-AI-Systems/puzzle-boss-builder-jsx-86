import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WordSearchEngine, WordSearchState } from '@/business/engines/word-search/WordSearchEngine';
import { WordSearchGrid } from './WordSearchGrid';
import { WordsList } from './WordsList';
import { WordSearchControls } from './WordSearchControls';
import { WordSearchCongratulations } from './WordSearchCongratulations';
import { WordSearchInstructions } from './WordSearchInstructions';
import { getRandomWordsFromCategory } from './WordListManager';
import { Cell } from '@/business/engines/word-search/types';
import { useGameTimer } from '../hooks/useGameTimer';

export function WordSearchGame() {
  const [engine] = useState(() => new WordSearchEngine(15)); // Increased grid size to 15x15
  const [gameState, setGameState] = useState<WordSearchState | null>(null);
  const [selectedCells, setSelectedCells] = useState<Cell[]>([]);
  const [currentSelection, setCurrentSelection] = useState<Cell[]>([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const { timeElapsed, isRunning, start, stop, reset } = useGameTimer();

  useEffect(() => {
    const unsubscribe = engine.subscribe((state) => {
      console.log('WordSearchGame: Received state update:', state);
      console.log('WordSearchGame: Grid data:', state.grid);
      console.log('WordSearchGame: Grid sample letters:', {
        '0,0': state.grid[0]?.[0],
        '0,5': state.grid[0]?.[5],
        '5,0': state.grid[5]?.[0],
        '5,5': state.grid[5]?.[5]
      });
      setGameState(state);
    });

    return unsubscribe;
  }, [engine]);

  const startNewGame = () => {
    console.log('WordSearchGame: Starting new game');
    
    // Get 20 words from the animals category with 'pro' difficulty
    const words = getRandomWordsFromCategory('animals', 20, 'pro');
    console.log('WordSearchGame: Selected words:', words);
    
    const initialState = engine.initializeGame(words);
    console.log('WordSearchGame: Initial state received:', initialState);
    
    setSelectedCells([]);
    setCurrentSelection([]);
    setShowInstructions(false);
    setIsGameStarted(true);
    reset();
    start();
  };

  const handleSelectionStart = (cell: Cell) => {
    if (!gameState || gameState.gameCompleted) return;
    setCurrentSelection([cell]);
  };

  const handleSelectionMove = (cell: Cell) => {
    if (!gameState || gameState.gameCompleted) return;
    
    setCurrentSelection(prev => {
      const cellId = `${cell.row}-${cell.col}`;
      const existingCellIds = prev.map(c => `${c.row}-${c.col}`);
      
      if (!existingCellIds.includes(cellId)) {
        return [...prev, cell];
      }
      return prev;
    });
  };

  const handleSelectionEnd = () => {
    if (!gameState || gameState.gameCompleted || currentSelection.length === 0) return;

    const cellIds = currentSelection.map(cell => `${cell.row}-${cell.col}`);
    const result = engine.validateWordSelection(cellIds);
    
    if (result.isValid && result.word) {
      // Add the selected cells to permanently highlighted cells
      setSelectedCells(prev => [...prev, ...currentSelection]);
      
      // Submit the word
      engine.makeMove({
        type: 'submit_word',
        cellIds
      });
    }
    
    setCurrentSelection([]);
  };

  const handleNewGame = () => {
    startNewGame();
  };

  const onGameComplete = () => {
    stop();
  };

  const renderGrid = () => {
    if (!gameState || !gameState.grid || gameState.grid.length === 0) {
      console.log('WordSearchGame: No grid data to render:', { 
        hasGameState: !!gameState, 
        hasGrid: gameState?.grid ? true : false,
        gridLength: gameState?.grid?.length 
      });
      return (
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
          <p className="text-gray-600">Loading puzzle...</p>
        </div>
      );
    }

    console.log('WordSearchGame: Rendering grid with data:', {
      gridSize: gameState.grid.length,
      firstRowLength: gameState.grid[0]?.length,
      sampleLetters: {
        '0,0': gameState.grid[0]?.[0],
        '0,1': gameState.grid[0]?.[1],
        '1,0': gameState.grid[1]?.[0],
        '1,1': gameState.grid[1]?.[1]
      }
    });

    return (
      <WordSearchGrid
        grid={gameState.grid}
        selectedCells={selectedCells}
        currentSelection={currentSelection}
        onSelectionStart={handleSelectionStart}
        onSelectionMove={handleSelectionMove}
        onSelectionEnd={handleSelectionEnd}
        isDisabled={gameState.gameCompleted}
      />
    );
  };

  if (showInstructions && !isGameStarted) {
    return (
      <WordSearchInstructions
        difficulty="pro"
        category="animals"
        totalWords={20}
        competitive={false}
        onStartGame={startNewGame}
      />
    );
  }

  if (gameState?.gameCompleted) {
    return (
      <WordSearchCongratulations
        isOpen={true}
        onClose={() => setShowInstructions(true)}
        timeElapsed={timeElapsed}
        wordsFound={gameState.foundWords.length}
        totalWords={gameState.targetWords.length}
        score={gameState.score}
        incorrectSelections={0}
        onPlayAgain={handleNewGame}
        onViewLeaderboard={() => {}}
        foundWords={gameState.foundWords}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Word Search Puzzle</span>
                <div className="text-sm font-normal">
                  Time: {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderGrid()}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Controls */}
          <WordSearchControls
            timeElapsed={Math.floor(timeElapsed / 1000)}
            isPaused={!isRunning}
            onPause={stop}
            onResume={start}
            onReset={handleNewGame}
            onHint={() => {}}
            hintsUsed={0}
            isGameComplete={gameState?.gameCompleted || false}
            onNewGame={handleNewGame}
          />

          {/* Words List */}
          {gameState && (
            <WordsList
              words={gameState.targetWords}
              foundWords={new Set(gameState.foundWords)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
