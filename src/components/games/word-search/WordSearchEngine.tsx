import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, Trophy, Target, CheckCircle, Play, AlertTriangle } from 'lucide-react';
import { useGameTimer } from '../hooks/useGameTimer';
import { WordSearchCongratulations } from './WordSearchCongratulations';
import { WordSearchLeaderboard } from './WordSearchLeaderboard';
import { useToast } from '@/hooks/use-toast';

interface WordSearchEngineProps {
  difficulty: 'rookie' | 'pro' | 'master';
  category: string;
  wordList: string[];
  onComplete?: (stats: { timeElapsed: number; wordsFound: number; totalWords: number; incorrectSelections: number }) => void;
  onWordFound?: (word: string, found: number, total: number) => void;
  onNewGame?: () => void;
  onBackToArena?: () => void;
  enablePenalties?: boolean;
  sessionId?: string;
}

interface FoundWord {
  word: string;
  startPos: [number, number];
  endPos: [number, number];
  direction: string;
  foundAt: number;
}

interface GameState {
  foundWords: FoundWord[];
  incorrectSelections: number;
  gameStarted: boolean;
  gameComplete: boolean;
  startTime: number | null;
  completionTime: number | null;
}

const WordSearchEngine: React.FC<WordSearchEngineProps> = ({
  difficulty,
  category,
  wordList,
  onComplete,
  onWordFound,
  onNewGame,
  onBackToArena,
  enablePenalties = true,
  sessionId = `ws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}) => {
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [foundWordDetails, setFoundWordDetails] = useState<FoundWord[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [incorrectSelections, setIncorrectSelections] = useState(0);
  const [score, setScore] = useState(0);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [grid, setGrid] = useState<string[][]>([]);
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<[number, number] | null>(null);
  const [lastSaveTime, setLastSaveTime] = useState<number>(0);
  
  const gridSize = difficulty === 'master' ? 15 : difficulty === 'pro' ? 12 : 10;
  const timeLimit = difficulty === 'master' ? 600 : difficulty === 'pro' ? 480 : 360;
  const { toast } = useToast();
  
  const { 
    timeElapsed, 
    isRunning, 
    start: startTimer, 
    stop: stopTimer
  } = useGameTimer(timeLimit);

  // Generate a stable grid based on wordList
  const placedWords = useMemo(() => {
    const newGrid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    const placed: FoundWord[] = [];
    
    // Simple word placement algorithm
    wordList.forEach((word, index) => {
      const direction = ['horizontal', 'vertical', 'diagonal'][index % 3];
      let placed_success = false;
      let attempts = 0;
      
      while (!placed_success && attempts < 50) {
        let startRow, startCol, deltaRow, deltaCol;
        
        if (direction === 'horizontal') {
          startRow = Math.floor(Math.random() * gridSize);
          startCol = Math.floor(Math.random() * (gridSize - word.length + 1));
          deltaRow = 0;
          deltaCol = 1;
        } else if (direction === 'vertical') {
          startRow = Math.floor(Math.random() * (gridSize - word.length + 1));
          startCol = Math.floor(Math.random() * gridSize);
          deltaRow = 1;
          deltaCol = 0;
        } else { // diagonal
          startRow = Math.floor(Math.random() * (gridSize - word.length + 1));
          startCol = Math.floor(Math.random() * (gridSize - word.length + 1));
          deltaRow = 1;
          deltaCol = 1;
        }
        
        // Check if word can be placed
        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          const row = startRow + i * deltaRow;
          const col = startCol + i * deltaCol;
          if (newGrid[row][col] !== '' && newGrid[row][col] !== word[i].toUpperCase()) {
            canPlace = false;
            break;
          }
        }
        
        if (canPlace) {
          // Place the word
          for (let i = 0; i < word.length; i++) {
            const row = startRow + i * deltaRow;
            const col = startCol + i * deltaCol;
            newGrid[row][col] = word[i].toUpperCase();
          }
          
          placed.push({
            word: word.toUpperCase(),
            startPos: [startRow, startCol],
            endPos: [startRow + (word.length - 1) * deltaRow, startCol + (word.length - 1) * deltaCol],
            direction,
            foundAt: 0
          });
          placed_success = true;
        }
        attempts++;
      }
    });
    
    // Fill empty cells with random letters
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (newGrid[row][col] === '') {
          newGrid[row][col] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }
    
    setGrid(newGrid);
    return placed;
  }, [wordList, gridSize]);

  // Save game state periodically
  const saveGameState = useCallback(() => {
    if (!gameStarted || gameComplete) return;
    
    const gameState: GameState = {
      foundWords: foundWordDetails,
      incorrectSelections,
      gameStarted,
      gameComplete,
      startTime: Date.now() - timeElapsed,
      completionTime: null
    };
    
    localStorage.setItem(`wordSearch_${sessionId}`, JSON.stringify(gameState));
    setLastSaveTime(Date.now());
  }, [foundWordDetails, incorrectSelections, gameStarted, gameComplete, timeElapsed, sessionId]);

  // Load saved game state
  const loadGameState = useCallback(() => {
    const saved = localStorage.getItem(`wordSearch_${sessionId}`);
    if (saved) {
      try {
        const gameState: GameState = JSON.parse(saved);
        if (gameState.gameStarted && !gameState.gameComplete) {
          setFoundWordDetails(gameState.foundWords);
          setFoundWords(new Set(gameState.foundWords.map(w => w.word)));
          setIncorrectSelections(gameState.incorrectSelections);
          setGameStarted(gameState.gameStarted);
          // Resume timer if needed
          if (gameState.startTime) {
            const elapsed = Date.now() - gameState.startTime;
            if (elapsed < timeLimit * 1000) {
              startTimer();
            }
          }
        }
      } catch (error) {
        console.error('Failed to load game state:', error);
      }
    }
  }, [sessionId, timeLimit, startTimer]);

  // Auto-save every 5 seconds
  useEffect(() => {
    if (gameStarted && !gameComplete) {
      const interval = setInterval(saveGameState, 5000);
      return () => clearInterval(interval);
    }
  }, [gameStarted, gameComplete, saveGameState]);

  // Check for word completion and auto-submit
  useEffect(() => {
    if (foundWords.size === wordList.length && gameStarted && !gameComplete) {
      // All words found - auto submit
      const completionTimeMs = timeElapsed;
      setGameComplete(true);
      stopTimer();
      
      // Clear saved state
      localStorage.removeItem(`wordSearch_${sessionId}`);
      
      // Calculate final score
      const baseScore = 1000;
      const timeBonus = Math.max(0, (timeLimit - Math.floor(completionTimeMs / 1000)) * 10);
      const penaltyDeduction = enablePenalties ? incorrectSelections * 50 : 0;
      const finalScore = Math.max(0, baseScore + timeBonus - penaltyDeduction);
      
      setScore(finalScore);
      setShowCongratulations(true);
      
      onComplete?.({
        timeElapsed: completionTimeMs,
        wordsFound: foundWords.size,
        totalWords: wordList.length,
        incorrectSelections
      });
      
      toast({
        title: "🎉 Puzzle Complete!",
        description: `All ${wordList.length} words found in ${(completionTimeMs / 1000).toFixed(2)} seconds!`,
      });
    }
  }, [foundWords.size, wordList.length, gameStarted, gameComplete, timeElapsed, stopTimer, sessionId, timeLimit, incorrectSelections, enablePenalties, onComplete, toast]);

  const handleCellMouseDown = (row: number, col: number) => {
    if (!gameStarted || gameComplete) return;
    
    setIsSelecting(true);
    setSelectionStart([row, col]);
    setSelectedCells(new Set([`${row}-${col}`]));
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (!isSelecting || !selectionStart) return;
    
    const [startRow, startCol] = selectionStart;
    const cells = new Set<string>();
    
    // Calculate direction and select cells in a line
    const deltaRow = row - startRow;
    const deltaCol = col - startCol;
    
    if (deltaRow === 0 || deltaCol === 0 || Math.abs(deltaRow) === Math.abs(deltaCol)) {
      const steps = Math.max(Math.abs(deltaRow), Math.abs(deltaCol));
      const stepRow = steps > 0 ? deltaRow / steps : 0;
      const stepCol = steps > 0 ? deltaCol / steps : 0;
      
      for (let i = 0; i <= steps; i++) {
        const currentRow = startRow + Math.round(i * stepRow);
        const currentCol = startCol + Math.round(i * stepCol);
        if (currentRow >= 0 && currentRow < gridSize && currentCol >= 0 && currentCol < gridSize) {
          cells.add(`${currentRow}-${currentCol}`);
        }
      }
    }
    
    setSelectedCells(cells);
  };

  const handleCellMouseUp = () => {
    if (!isSelecting || !selectionStart || selectedCells.size === 0) {
      setIsSelecting(false);
      setSelectedCells(new Set());
      return;
    }
    
    // Check if selection forms a valid word
    const selectedWord = Array.from(selectedCells)
      .sort((a, b) => {
        const [rowA, colA] = a.split('-').map(Number);
        const [rowB, colB] = b.split('-').map(Number);
        return rowA - rowB || colA - colB;
      })
      .map(cellId => {
        const [row, col] = cellId.split('-').map(Number);
        return grid[row][col];
      })
      .join('');
    
    const reverseWord = selectedWord.split('').reverse().join('');
    
    // Check if it's a valid word from our list
    const targetWord = wordList.find(word => 
      word.toUpperCase() === selectedWord || word.toUpperCase() === reverseWord
    );
    
    if (targetWord && !foundWords.has(targetWord.toUpperCase())) {
      // Word found!
      const newFoundWords = new Set(foundWords);
      newFoundWords.add(targetWord.toUpperCase());
      setFoundWords(newFoundWords);
      
      // Record detailed info
      const [startRow, startCol] = selectionStart;
      const lastCell = Array.from(selectedCells).pop();
      const [endRow, endCol] = lastCell ? lastCell.split('-').map(Number) : [startRow, startCol];
      
      const newWordDetail: FoundWord = {
        word: targetWord.toUpperCase(),
        startPos: [startRow, startCol],
        endPos: [endRow, endCol],
        direction: 'custom',
        foundAt: timeElapsed
      };
      
      setFoundWordDetails(prev => [...prev, newWordDetail]);
      
      onWordFound?.(targetWord, newFoundWords.size, wordList.length);
      
      toast({
        title: "Word Found!",
        description: `${targetWord.toUpperCase()} - ${newFoundWords.size}/${wordList.length} words found`,
      });
    } else if (enablePenalties && selectedCells.size > 1) {
      // Incorrect selection penalty
      setIncorrectSelections(prev => prev + 1);
      toast({
        title: "Incorrect Selection",
        description: "That's not a valid word. Penalty applied!",
        variant: "destructive",
      });
    }
    
    setIsSelecting(false);
    setSelectedCells(new Set());
    setSelectionStart(null);
  };

  const handleStartGame = () => {
    setGameStarted(true);
    startTimer();
    
    toast({
      title: "Game Started!",
      description: `Find all ${wordList.length} words as quickly as possible!`,
    });
  };

  const handleNewGame = () => {
    setFoundWords(new Set());
    setFoundWordDetails([]);
    setGameStarted(false);
    setGameComplete(false);
    setIncorrectSelections(0);
    setScore(0);
    setShowCongratulations(false);
    setSelectedCells(new Set());
    setIsSelecting(false);
    setSelectionStart(null);
    localStorage.removeItem(`wordSearch_${sessionId}`);
    onNewGame?.();
  };

  const progressPercentage = (foundWords.size / wordList.length) * 100;
  const remainingWords = wordList.filter(word => !foundWords.has(word.toUpperCase()));

  // Load saved state on component mount
  useEffect(() => {
    loadGameState();
  }, [loadGameState]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Game Header */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-puzzle-white text-center">
            Word Search - {category} ({difficulty})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Game Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-800 rounded-lg p-3">
              <Clock className="h-5 w-5 mx-auto mb-1 text-puzzle-aqua" />
              <div className="text-xl font-bold text-puzzle-white">
                {(timeElapsed / 1000).toFixed(2)}s
              </div>
              <div className="text-xs text-gray-400">Time</div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-3">
              <Target className="h-5 w-5 mx-auto mb-1 text-puzzle-gold" />
              <div className="text-xl font-bold text-puzzle-white">
                {foundWords.size}/{wordList.length}
              </div>
              <div className="text-xs text-gray-400">Words Found</div>
            </div>
            
            {enablePenalties && (
              <div className="bg-gray-800 rounded-lg p-3">
                <AlertTriangle className="h-5 w-5 mx-auto mb-1 text-red-400" />
                <div className="text-xl font-bold text-puzzle-white">
                  {incorrectSelections}
                </div>
                <div className="text-xs text-gray-400">Penalties</div>
              </div>
            )}
            
            <div className="bg-gray-800 rounded-lg p-3">
              <Trophy className="h-5 w-5 mx-auto mb-1 text-puzzle-gold" />
              <div className="text-xl font-bold text-puzzle-white">
                {score}
              </div>
              <div className="text-xs text-gray-400">Score</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-300">
              <span>Progress</span>
              <span>{progressPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
          </div>

          {/* Game Controls */}
          <div className="flex justify-center gap-4">
            {!gameStarted ? (
              <Button
                onClick={handleStartGame}
                className="bg-puzzle-aqua hover:bg-puzzle-aqua/80 text-puzzle-black font-semibold"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Game
              </Button>
            ) : (
              <Button
                onClick={handleNewGame}
                variant="outline"
                className="border-puzzle-gold text-puzzle-gold hover:bg-puzzle-gold hover:text-puzzle-black"
              >
                New Game
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Game Grid */}
      {gameStarted && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Word Search Grid */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4">
                <div 
                  className="grid mx-auto bg-gray-600 p-px"
                  style={{ 
                    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                    maxWidth: '500px',
                    gap: '1px'
                  }}
                  onMouseLeave={() => {
                    setIsSelecting(false);
                    setSelectedCells(new Set());
                  }}
                >
                  {grid.map((row, rowIndex) =>
                    row.map((letter, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                          w-8 h-8 flex items-center justify-center
                          text-sm font-bold cursor-pointer transition-colors
                          ${selectedCells.has(`${rowIndex}-${colIndex}`) 
                            ? 'bg-puzzle-aqua text-puzzle-black' 
                            : 'bg-gray-800 text-puzzle-white hover:bg-gray-700'
                          }
                        `}
                        onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                        onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                        onMouseUp={handleCellMouseUp}
                      >
                        {letter}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Word List */}
          <div className="space-y-4">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-puzzle-white text-lg">Words to Find</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                {wordList.map((word, index) => (
                  <div
                    key={index}
                    className={`
                      flex items-center justify-between p-2 rounded
                      ${foundWords.has(word.toUpperCase())
                        ? 'bg-green-900/50 text-green-300'
                        : 'bg-gray-800 text-gray-300'
                      }
                    `}
                  >
                    <span className={foundWords.has(word.toUpperCase()) ? 'line-through' : ''}>
                      {word.toUpperCase()}
                    </span>
                    {foundWords.has(word.toUpperCase()) && (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Remaining Words Count */}
            {remainingWords.length > 0 && (
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-puzzle-aqua">
                    {remainingWords.length}
                  </div>
                  <div className="text-sm text-gray-400">
                    words remaining
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Congratulations Modal */}
      {showCongratulations && (
        <WordSearchCongratulations
          isOpen={showCongratulations}
          onClose={() => setShowCongratulations(false)}
          timeElapsed={timeElapsed}
          wordsFound={foundWords.size}
          totalWords={wordList.length}
          score={score}
          incorrectSelections={incorrectSelections}
          onPlayAgain={handleNewGame}
          onViewLeaderboard={() => setShowLeaderboard(true)}
        />
      )}

      {/* Leaderboard */}
      {showLeaderboard && (
        <WordSearchLeaderboard
          isOpen={showLeaderboard}
          onClose={() => setShowLeaderboard(false)}
          difficulty={difficulty}
          category={category}
        />
      )}
    </div>
  );
};

export default WordSearchEngine;
