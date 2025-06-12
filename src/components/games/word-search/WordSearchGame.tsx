
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Trophy, RotateCw, Lightbulb } from 'lucide-react';
import { WordSearchEngine, WordSearchState } from '@/business/engines/word-search';
import { useToast } from '@/hooks/use-toast';

const SAMPLE_WORDS = ['PUZZLE', 'GAME', 'WORD', 'SEARCH', 'FUN', 'PLAY', 'SOLVE', 'BRAIN'];

export const WordSearchGame: React.FC = () => {
  const [engine] = useState(() => new WordSearchEngine(12));
  const [gameState, setGameState] = useState<WordSearchState | null>(null);
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintedCells, setHintedCells] = useState<Set<string>>(new Set());
  const [maxHints] = useState(3);
  const { toast } = useToast();

  const handleGameStateChange = useCallback((state: WordSearchState) => {
    setGameState(state);
    
    if (state.gameCompleted && gameStarted) {
      toast({
        title: "Congratulations!",
        description: `You found all words! Score: ${state.score}`,
      });
    }
  }, [gameStarted, toast]);

  useEffect(() => {
    const unsubscribe = engine.subscribe(handleGameStateChange);
    return unsubscribe;
  }, [engine, handleGameStateChange]);

  const startNewGame = () => {
    try {
      engine.initializeGame(SAMPLE_WORDS);
      setSelectedCells(new Set());
      setGameStarted(true);
      setHintsUsed(0);
      setHintedCells(new Set());
    } catch (error) {
      console.error('Error starting game:', error);
      toast({
        title: "Error",
        description: "Failed to start game. Please try again.",
        variant: "destructive"
      });
    }
  };

  const useHint = () => {
    if (!gameState || hintsUsed >= maxHints || gameState.gameCompleted) return;

    // Find a word that hasn't been found yet
    const remainingWords = gameState.targetWords.filter(word => !gameState.foundWords.includes(word));
    
    if (remainingWords.length > 0) {
      // Get the first remaining word and highlight its cells
      const wordToHint = remainingWords[0];
      const placedWord = gameState.placedWords.find(pw => pw.word === wordToHint);
      
      if (placedWord && placedWord.cells) {
        const hintCells = new Set(placedWord.cells.map(cell => `${cell.row}-${cell.col}`));
        setHintedCells(hintCells);
        setHintsUsed(prev => prev + 1);
        
        toast({
          title: "Hint!",
          description: `Look for the word: ${wordToHint}`,
        });

        // Clear hint after 3 seconds
        setTimeout(() => {
          setHintedCells(new Set());
        }, 3000);
      }
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (!gameState || gameState.gameCompleted) return;

    const cellId = `${row}-${col}`;
    
    if (!isSelecting) {
      // Start new selection
      setSelectedCells(new Set([cellId]));
      setIsSelecting(true);
      engine.makeMove({ type: 'select_cells', cellIds: [cellId] });
    } else {
      // Continue selection
      const newSelection = new Set(selectedCells);
      if (newSelection.has(cellId)) {
        newSelection.delete(cellId);
      } else {
        newSelection.add(cellId);
      }
      setSelectedCells(newSelection);
      engine.makeMove({ type: 'select_cells', cellIds: Array.from(newSelection) });
    }
  };

  const handleSubmitSelection = () => {
    if (!gameState || selectedCells.size === 0) return;

    const cellIds = Array.from(selectedCells);
    const result = engine.validateWordSelection(cellIds);
    
    if (result.isValid && result.word) {
      engine.makeMove({ type: 'submit_word', cellIds });
      toast({
        title: "Word Found!",
        description: `You found: ${result.word}`,
      });
    } else {
      toast({
        title: "Not a word",
        description: "Try selecting a different combination of letters.",
        variant: "destructive"
      });
    }
    
    setSelectedCells(new Set());
    setIsSelecting(false);
    engine.makeMove({ type: 'clear_selection' });
  };

  const clearSelection = () => {
    setSelectedCells(new Set());
    setIsSelecting(false);
    engine.makeMove({ type: 'clear_selection' });
  };

  const getCellClasses = (row: number, col: number) => {
    const cellId = `${row}-${col}`;
    const isSelected = selectedCells.has(cellId);
    const isHinted = hintedCells.has(cellId);
    const isFoundWord = gameState?.foundWords.some(word => {
      // Check if this cell is part of any found word
      return gameState.placedWords.some(placedWord => 
        placedWord.word === word && 
        placedWord.cells?.some(cell => cell.row === row && cell.col === col)
      );
    });

    return `
      w-8 h-8 border border-gray-300 flex items-center justify-center cursor-pointer text-sm font-bold
      transition-colors duration-200
      ${isSelected ? 'bg-blue-200 border-blue-400' : ''}
      ${isFoundWord ? 'bg-green-200 border-green-400' : ''}
      ${isHinted ? 'bg-yellow-200 border-yellow-400 animate-pulse' : ''}
      ${!isSelected && !isFoundWord && !isHinted ? 'hover:bg-gray-100' : ''}
    `.trim();
  };

  if (!gameStarted || !gameState) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Word Search Game</CardTitle>
            <p className="text-muted-foreground">Find all the hidden words in the grid!</p>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={startNewGame} size="lg">
              Start New Game
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Game Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Word Search</CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="font-semibold">Score: {gameState.score}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={useHint}
                  disabled={hintsUsed >= maxHints || gameState.gameCompleted}
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Lightbulb className="h-4 w-4" />
                  Hint ({maxHints - hintsUsed})
                </Button>
                <Button onClick={startNewGame} variant="outline" size="sm">
                  <RotateCw className="h-4 w-4 mr-2" />
                  New Game
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="grid gap-1 justify-center" style={{ 
                gridTemplateColumns: `repeat(${gameState.grid.length}, 1fr)`,
                maxWidth: 'fit-content',
                margin: '0 auto'
              }}>
                {gameState.grid.map((row, rowIndex) =>
                  row.map((letter, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={getCellClasses(rowIndex, colIndex)}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                    >
                      {letter}
                    </div>
                  ))
                )}
              </div>
              
              {/* Selection Controls */}
              {selectedCells.size > 0 && (
                <div className="mt-4 flex justify-center gap-2">
                  <Button onClick={handleSubmitSelection} variant="default">
                    Submit Word ({selectedCells.size} letters)
                  </Button>
                  <Button onClick={clearSelection} variant="outline">
                    Clear Selection
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Words List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Words to Find</CardTitle>
              <p className="text-sm text-muted-foreground">
                {gameState.foundWords.length} of {gameState.targetWords.length} found
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {gameState.targetWords.map(word => (
                  <div key={word} className="flex items-center justify-between">
                    <span className={`font-medium ${
                      gameState.foundWords.includes(word) 
                        ? 'line-through text-muted-foreground' 
                        : ''
                    }`}>
                      {word}
                    </span>
                    {gameState.foundWords.includes(word) && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Found
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
              
              {gameState.gameCompleted && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg text-center">
                  <h3 className="font-bold text-green-800 mb-2">Congratulations!</h3>
                  <p className="text-green-700">You found all the words!</p>
                  <p className="text-sm text-green-600 mt-1">Final Score: {gameState.score}</p>
                  <p className="text-sm text-green-600">Hints used: {hintsUsed}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
