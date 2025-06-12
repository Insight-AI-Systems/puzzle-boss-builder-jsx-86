
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
  const [engine] = useState(() => new WordSearchEngine(15));
  const [gameState, setGameState] = useState<WordSearchState | null>(null);
  const [selectedCells, setSelectedCells] = useState<Cell[]>([]);
  const [currentSelection, setCurrentSelection] = useState<Cell[]>([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintCells, setHintCells] = useState<Cell[]>([]);

  // Fixed timer - using seconds instead of milliseconds
  const { timeElapsed, isRunning, start, stop, reset } = useGameTimer();
  const timeElapsedInSeconds = Math.floor(timeElapsed / 1000);

  useEffect(() => {
    const unsubscribe = engine.subscribe((state) => {
      console.log('WordSearchGame: Received state update:', state);
      setGameState(state);
    });

    return unsubscribe;
  }, [engine]);

  const startNewGame = () => {
    console.log('WordSearchGame: Starting new game');
    
    const words = getRandomWordsFromCategory('animals', 20, 'pro');
    console.log('WordSearchGame: Selected words:', words);
    
    const initialState = engine.initializeGame(words);
    console.log('WordSearchGame: Initial state received:', initialState);
    
    // Reset all game state
    setSelectedCells([]);
    setCurrentSelection([]);
    setHintsUsed(0);
    setHintCells([]);
    setShowInstructions(false);
    setIsGameStarted(true);
    
    // Reset and start timer
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
      if (prev.length === 0) return [cell];
      
      const start = prev[0];
      const cellsBetween = generateLineBetweenCells(start, cell);
      return cellsBetween;
    });
  };

  const generateLineBetweenCells = (start: Cell, end: Cell): Cell[] => {
    const cells: Cell[] = [];
    const deltaRow = end.row - start.row;
    const deltaCol = end.col - start.col;
    
    // Only allow straight lines (horizontal, vertical, diagonal)
    const isHorizontal = deltaRow === 0 && deltaCol !== 0;
    const isVertical = deltaCol === 0 && deltaRow !== 0;
    const isDiagonal = Math.abs(deltaRow) === Math.abs(deltaCol) && deltaRow !== 0 && deltaCol !== 0;
    
    if (!isHorizontal && !isVertical && !isDiagonal) {
      return [start]; // Return just the start cell if not a valid line
    }
    
    const steps = Math.max(Math.abs(deltaRow), Math.abs(deltaCol));
    const stepRow = steps === 0 ? 0 : deltaRow / steps;
    const stepCol = steps === 0 ? 0 : deltaCol / steps;
    
    for (let i = 0; i <= steps; i++) {
      cells.push({
        row: start.row + Math.round(stepRow * i),
        col: start.col + Math.round(stepCol * i)
      });
    }
    
    return cells;
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
      
      // Clear hint cells if word was found
      setHintCells([]);
    }
    
    setCurrentSelection([]);
  };

  const handleNewGame = () => {
    startNewGame();
  };

  const handlePause = () => {
    stop();
  };

  const handleResume = () => {
    start();
  };

  const handleHint = () => {
    if (!gameState || gameState.gameCompleted || hintsUsed >= 3) return;
    
    // Find an unfound word
    const unfoundWords = gameState.placedWords.filter(
      placedWord => !gameState.foundWords.includes(placedWord.word)
    );
    
    if (unfoundWords.length > 0) {
      const randomWord = unfoundWords[Math.floor(Math.random() * unfoundWords.length)];
      setHintCells(randomWord.cells);
      setHintsUsed(prev => prev + 1);
      
      // Clear hint after 3 seconds
      setTimeout(() => {
        setHintCells([]);
      }, 3000);
    }
  };

  const onGameComplete = () => {
    stop();
  };

  // Auto-complete game when all words found
  useEffect(() => {
    if (gameState && gameState.foundWords.length === gameState.targetWords.length && !gameState.gameCompleted) {
      onGameComplete();
    }
  }, [gameState]);

  const renderGrid = () => {
    if (!gameState || !gameState.grid || gameState.grid.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
          <p className="text-gray-600">Loading puzzle...</p>
        </div>
      );
    }

    return (
      <WordSearchGrid
        grid={gameState.grid}
        selectedCells={selectedCells}
        currentSelection={currentSelection}
        hintCells={hintCells}
        onSelectionStart={handleSelectionStart}
        onSelectionMove={handleSelectionMove}
        onSelectionEnd={handleSelectionEnd}
        isDisabled={gameState.gameCompleted}
      />
    );
  };

  if (showInstructions && !isGameStarted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <WordSearchInstructions
          difficulty="pro"
          category="animals"
          totalWords={20}
          competitive={false}
        />
        <div className="mt-6 text-center">
          <Button onClick={startNewGame} size="lg" className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black font-semibold">
            Start Game
          </Button>
        </div>
      </div>
    );
  }

  if (gameState?.gameCompleted) {
    return (
      <WordSearchCongratulations
        isOpen={true}
        onClose={() => setShowInstructions(true)}
        timeElapsed={timeElapsedInSeconds}
        wordsFound={gameState.foundWords.length}
        totalWords={gameState.targetWords.length}
        score={gameState.score}
        incorrectSelections={0}
        onPlayAgain={handleNewGame}
        onViewLeaderboard={() => {}}
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
                  Time: {Math.floor(timeElapsedInSeconds / 60)}:{(timeElapsedInSeconds % 60).toString().padStart(2, '0')}
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
            timeElapsed={timeElapsedInSeconds}
            isPaused={!isRunning}
            onPause={handlePause}
            onResume={handleResume}
            onReset={handleNewGame}
            onHint={handleHint}
            hintsUsed={hintsUsed}
            isGameComplete={gameState?.gameCompleted || false}
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
