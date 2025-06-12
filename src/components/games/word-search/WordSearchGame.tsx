import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Timer, RotateCcw, Trophy, Lightbulb } from 'lucide-react';
import { WordSearchEngine } from '@/business/engines/word-search/WordSearchEngine';
import { getRandomWordsFromCategory } from './WordListManager';
import { useGameTimer } from '../hooks/useGameTimer';
import { useToast } from '@/hooks/use-toast';

export const WordSearchGame: React.FC = () => {
  const [engine, setEngine] = useState<WordSearchEngine | null>(null);
  const [gameState, setGameState] = useState<any>(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startCell, setStartCell] = useState<string | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  
  const { timeElapsed, isRunning, start, pause, resume, reset } = useGameTimer();
  const { toast } = useToast();

  const startNewGame = useCallback(() => {
    // Get 20 words from the animals category using 'pro' difficulty
    const words = getRandomWordsFromCategory('animals', 20, 'pro');
    
    // Create new engine with 15x15 grid to accommodate more words
    const newEngine = new WordSearchEngine(15);
    const initialState = newEngine.initializeGame(words);
    
    setEngine(newEngine);
    setGameState(initialState);
    setIsGameStarted(true);
    setFoundWords([]);
    setSelectedCells([]);
    setHintsUsed(0);
    reset();
    start();
  }, [reset, start]);

  useEffect(() => {
    if (engine && isGameStarted) {
      // Engine is available and game is started
    }
  }, [engine, isGameStarted]);

  const handleMouseDown = (cellId: string) => {
    if (!isGameStarted || !engine) return;
    
    setIsDragging(true);
    setStartCell(cellId);
    setSelectedCells([cellId]);
  };

  const handleMouseEnter = (cellId: string) => {
    if (!isDragging || !startCell || !engine) return;
    
    // Calculate if the selection forms a valid line
    const [startRow, startCol] = startCell.split('-').map(Number);
    const [currentRow, currentCol] = cellId.split('-').map(Number);
    
    const deltaRow = currentRow - startRow;
    const deltaCol = currentCol - startCol;
    
    // Check if it's a valid line (horizontal, vertical, or diagonal)
    const isHorizontal = deltaRow === 0;
    const isVertical = deltaCol === 0;
    const isDiagonal = Math.abs(deltaRow) === Math.abs(deltaCol);
    
    if (isHorizontal || isVertical || isDiagonal) {
      const cells = generateLineCells(startCell, cellId);
      setSelectedCells(cells);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging || !engine || selectedCells.length < 2) {
      setIsDragging(false);
      setSelectedCells([]);
      return;
    }
    
    const result = engine.validateWordSelection(selectedCells);
    if (result.isValid && result.word) {
      const newState = engine.makeMove({
        type: 'submit_word',
        cellIds: selectedCells
      });
      
      setGameState(newState);
      setFoundWords(newState.foundWords);
      
      toast({
        title: "Word Found!",
        description: `You found: ${result.word}`,
      });
      
      if (newState.gameCompleted) {
        pause();
        toast({
          title: "Congratulations!",
          description: `You completed the puzzle in ${Math.floor(timeElapsed / 60000)}:${((timeElapsed % 60000) / 1000).toFixed(0).padStart(2, '0')}!`,
        });
      }
    }
    
    setIsDragging(false);
    setSelectedCells([]);
    setStartCell(null);
  };

  const generateLineCells = (start: string, end: string): string[] => {
    const [startRow, startCol] = start.split('-').map(Number);
    const [endRow, endCol] = end.split('-').map(Number);
    
    const deltaRow = endRow - startRow;
    const deltaCol = endCol - startCol;
    const steps = Math.max(Math.abs(deltaRow), Math.abs(deltaCol));
    
    const cells: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const row = startRow + Math.round((deltaRow * i) / steps);
      const col = startCol + Math.round((deltaCol * i) / steps);
      cells.push(`${row}-${col}`);
    }
    
    return cells;
  };

  const showHint = () => {
    if (!gameState || hintsUsed >= 3) return;
    
    const remainingWords = gameState.targetWords.filter(
      (word: string) => !foundWords.includes(word)
    );
    
    if (remainingWords.length > 0) {
      const randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];
      setHintsUsed(prev => prev + 1);
      
      toast({
        title: "Hint",
        description: `Look for: ${randomWord}`,
      });
    }
  };

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderGrid = () => {
    if (!gameState) return null;
    
    const { grid } = gameState;
    const gridSize = grid.length;
    
    return (
      <div 
        className="grid gap-1 mx-auto select-none"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          maxWidth: '600px'
        }}
        onMouseLeave={() => {
          if (isDragging) {
            setIsDragging(false);
            setSelectedCells([]);
            setStartCell(null);
          }
        }}
      >
        {grid.map((row: string[], rowIndex: number) =>
          row.map((letter: string, colIndex: number) => {
            const cellId = `${rowIndex}-${colIndex}`;
            const isSelected = selectedCells.includes(cellId);
            const isFound = foundWords.some(word => {
              const placedWord = gameState.placedWords.find((pw: any) => pw.word === word);
              return placedWord?.cells.some((cell: any) => `${cell.row}-${cell.col}` === cellId);
            });
            
            return (
              <div
                key={cellId}
                className={`
                  w-8 h-8 flex items-center justify-center text-sm font-bold
                  border border-gray-300 cursor-pointer transition-all duration-150
                  ${isSelected ? 'bg-blue-300 border-blue-500' : ''}
                  ${isFound ? 'bg-green-200 border-green-400' : 'bg-white hover:bg-gray-100'}
                `}
                onMouseDown={() => handleMouseDown(cellId)}
                onMouseEnter={() => handleMouseEnter(cellId)}
                onMouseUp={handleMouseUp}
              >
                {letter}
              </div>
            );
          })
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Word Search Puzzle</span>
            <div className="flex items-center gap-4">
              {isGameStarted && (
                <div className="flex items-center gap-2 text-sm">
                  <Timer className="h-4 w-4" />
                  {formatTime(timeElapsed)}
                </div>
              )}
              <Button onClick={startNewGame} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                New Game
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!isGameStarted ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">Ready to Start?</h3>
              <p className="text-gray-600 mb-6">
                Find all the hidden words in the puzzle. Words can be horizontal, vertical, or diagonal!
              </p>
              <Button onClick={startNewGame} size="lg">
                Start New Game
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div className="flex gap-4 text-sm">
                  <span>Found: {foundWords.length}/{gameState?.targetWords.length || 0}</span>
                  <span>Score: {gameState?.score || 0}</span>
                </div>
                <Button
                  onClick={showHint}
                  disabled={hintsUsed >= 3}
                  variant="outline"
                  size="sm"
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Hint ({3 - hintsUsed} left)
                </Button>
              </div>
              
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  {renderGrid()}
                </div>
                
                <div className="lg:w-80">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Words to Find</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                        {gameState?.targetWords.map((word: string) => (
                          <Badge
                            key={word}
                            variant={foundWords.includes(word) ? "default" : "outline"}
                            className={`justify-center ${
                              foundWords.includes(word) 
                                ? 'bg-green-100 text-green-800 line-through' 
                                : ''
                            }`}
                          >
                            {word}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {gameState?.gameCompleted && (
                <div className="text-center py-6 bg-green-50 rounded-lg border border-green-200">
                  <Trophy className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-800 mb-2">Congratulations!</h3>
                  <p className="text-green-700">
                    You found all words in {formatTime(timeElapsed)}!
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
